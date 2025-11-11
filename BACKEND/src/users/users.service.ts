import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from '../roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    private readonly saltRounds = 10;

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        // Créer le compte admin par défaut au démarrage
        this.initializeDefaultAdmin();
    }

    private async initializeDefaultAdmin() {
        const adminEmail = 'admin@flux.com';
        const adminPassword = 'Admin@123456'; // À changer en production !

        // Vérifier si l'admin n'existe pas déjà
        const existingAdmin = await this.userRepository.findOne({
            where: { userEmail: adminEmail }
        });
        
        if (existingAdmin) {
            return;
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(adminPassword, this.saltRounds);

        // Créer le compte admin (TypeORM génère automatiquement l'UUID)
        const admin = this.userRepository.create({
            userName: 'Admin',
            userLastname: 'System',
            userEmail: adminEmail,
            usersPassword: hashedPassword,
            userBirthdate: new Date('1990-01-01'),
            userRole: UserRole.ADMIN,
            userLastlogin: null,
            userIsadult: true,
            userContentFilter: 'all',
            userAcceptedPolicy: new Date(),
        });

        await this.userRepository.save(admin);
        console.log('✅ Compte admin par défaut créé : admin@flux.com / Admin@123456');
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        // Vérifier si l'email existe déjà
        const existingUser = await this.userRepository.findOne({
            where: { userEmail: createUserDto.userEmail }
        });
        
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(createUserDto.usersPassword, this.saltRounds);

        // Créer l'utilisateur (TypeORM génère l'UUID et gère les timestamps)
        const user = this.userRepository.create({
            userName: createUserDto.userName,
            userLastname: createUserDto.userLastname,
            userEmail: createUserDto.userEmail,
            usersPassword: hashedPassword,
            userBirthdate: new Date(createUserDto.userBirthdate),
            userRole: UserRole.USER,
            userLastlogin: null,
            userIsadult: this.calculateAge(createUserDto.userBirthdate) >= 18,
            userContentFilter: createUserDto.userContentFilter || 'safe',
            userAcceptedPolicy: new Date(createUserDto.userAcceptedPolicy),
        });
        
        return await this.userRepository.save(user);
    }

    private calculateAge(birthdate: string): number {
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
            
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
            
        return age;
    }
    
    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { userEmail: email }
        });
    }

    async findOne(userId: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { userId }
        });
    }
    
    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { userId }
        });
        
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        
        // Extraire et convertir les dates
        const { userBirthdate, userAcceptedPolicy, ...otherFields } = updateUserDto;
        
        // Appliquer les mises à jour
        Object.assign(user, otherFields);
        
        if (userBirthdate) {
            user.userBirthdate = new Date(userBirthdate);
            user.userIsadult = this.calculateAge(userBirthdate) >= 18;
        }
        
        if (userAcceptedPolicy) {
            user.userAcceptedPolicy = new Date(userAcceptedPolicy);
        }
        
        return await this.userRepository.save(user);
    }

    async remove(userId: string): Promise<void> {
        const result = await this.userRepository.delete(userId);
        
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
    }

    async updateLastLogin(userId: string): Promise<void> {
        await this.userRepository.update(userId, {
            userLastlogin: new Date()
        });
    }
}

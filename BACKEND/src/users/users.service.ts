import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from '../roles/entities/role.entity';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

// users.service.ts
@Injectable()
export class UsersService {
    private users: User[] = []; // ← Entity (stockage interne)
    private readonly saltRounds = 10;

    constructor() {
        // Créer le compte admin par défaut au démarrage
        this.initializeDefaultAdmin();
    }

    private async initializeDefaultAdmin() {
        const adminEmail = 'admin@flux.com';
        const adminPassword = 'Admin@123456'; // À changer en production !

        // Vérifier si l'admin n'existe pas déjà
        const existingAdmin = this.findByEmail(adminEmail);
        if (existingAdmin) {
            return;
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(adminPassword, this.saltRounds);

        // Créer le compte admin
        const admin: User = {
            userId: uuid(),
            userName: 'Admin',
            userLastname: 'System',
            userEmail: adminEmail,
            usersPassword: hashedPassword,
            userBirthdate: new Date('1990-01-01'),
            userRole: UserRole.ADMIN, // ✅ Rôle ADMIN
            userCreatedAt: new Date(),
            userUpdatedAt: new Date(),
            userLastlogin: null,
            userIsadult: true,
            userContentFilter: 'all',
            userAcceptedPolicy: new Date(),
        };

        this.users.push(admin);
        console.log('✅ Compte admin par défaut créé : admin@flux.com / Admin@123456');
    }

    // Méthode qui REÇOIT le dto createUser et RETOURNE une Entity cretaUser
    async create(createUserDto: CreateUserDto): Promise<User> { // ← DTO en entrée
        
        const existingUser = this.findByEmail(createUserDto.userEmail);
            if (existingUser) {
                throw new ConflictException('Email already exists');
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(createUserDto.usersPassword, this.saltRounds);

        const user: User = {                        // ← Entity créée
            userId: uuid(),
            userName: createUserDto.userName,
            userLastname: createUserDto.userLastname,
            userEmail: createUserDto.userEmail,
            usersPassword: hashedPassword,
            userBirthdate: new Date(createUserDto.userBirthdate),
            userRole: UserRole.USER, // Rôle par défaut
            userCreatedAt: new Date(),
            userUpdatedAt: new Date(),
            userLastlogin: null,
            userIsadult: this.calculateAge(createUserDto.userBirthdate) >= 18,
            userContentFilter: createUserDto.userContentFilter || 'safe',
            userAcceptedPolicy: new Date(createUserDto.userAcceptedPolicy),
        };
        
        this.users.push(user);
        return user;  // ← Entity en sortie
    }

    

    private calculateAge(birthdate: string): number {
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
            
        // Si l'anniversaire n'est pas encore passé cette année, on retire 1
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
            
        return age;
    }
    
    // Méthode pour vérifier le mot de passe lors de la connexion
    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Trouver un utilisateur par email (utile pour le login)
    findByEmail(email: string): User | undefined {
    return this.users.find(user => user.userEmail === email);
    }

    // Trouver un utilisateur par ID
    findOne(userId: string): User | undefined {
    return this.users.find(user => user.userId === userId);
    }
    
    findAll(): User[] {  // ← Retourne des Entities
        return this.users;
    }

    // Mettre à jour un utilisateur
    update(userId: string, updateUserDto: UpdateUserDto): User | undefined {
        const userIndex = this.users.findIndex(user => user.userId === userId);
        if (userIndex === -1) return undefined;
        
        // Extraire et convertir les dates
        const { userBirthdate, userAcceptedPolicy, ...otherFields } = updateUserDto;
        
        const updatedData: Partial<User> = {
            ...otherFields,
            userUpdatedAt: new Date(),
        };
        
        // Convertir userBirthdate si présent
        if (userBirthdate) {
            updatedData.userBirthdate = new Date(userBirthdate);
            updatedData.userIsadult = this.calculateAge(userBirthdate) >= 18;
        }
        
        // Convertir userAcceptedPolicy si présent
        if (userAcceptedPolicy) {
            updatedData.userAcceptedPolicy = new Date(userAcceptedPolicy);
        }
        
        this.users[userIndex] = {
            ...this.users[userIndex],
            ...updatedData,
        };
        
        return this.users[userIndex];
    }

    // Supprimer un utilisateur
    remove(userId: string): boolean {
    const userIndex = this.users.findIndex(user => user.userId === userId);
    if (userIndex === -1) return false;
    
    this.users.splice(userIndex, 1);
    return true;
    }

    // Mettre à jour la date de dernière connexion
    updateLastLogin(userId: string): void {
    const user = this.findOne(userId);
    if (user) {
        user.userLastlogin = new Date();
        user.userUpdatedAt = new Date();
    }
    }
  
}

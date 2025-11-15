



function Galery() {

    const mockImages = [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
        "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368",
        "https://images.unsplash.com/photo-1519985176271-adb1088fa94c",
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
    ];
    return (<>
        <div className="gallery-vertical">
            {mockImages.map((img, idx) => (
            <div className="gallery-image-card" key={idx}>
                <img src={img} alt={`Générée ${idx + 1}`} />
            </div>
            ))}
        </div>
    </>)
}

export default Galery;
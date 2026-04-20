(function initPlantData(window) {
    const STORAGE_KEY = 'gh_plant_inventory_v2';

    const DEFAULT_PLANT_IMAGE = 'https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

    const MASTER_PLANTS_BY_CATEGORY = {
        'Citrus': [
            { id: 1, name: 'Yellow Lemon', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 2, name: 'American Lemon', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 3, name: 'Dayap', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 4, name: 'Pomegrenate', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 5, name: 'Calamansi', price: 200, image: DEFAULT_PLANT_IMAGE },
            { id: 6, name: 'Suha Davao', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 7, name: 'Calamandarin', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 8, name: 'Davao Pomelo', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 9, name: 'Dalanghita', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 10, name: 'Satsuma Citrus', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 11, name: 'Japanese Orange', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 12, name: 'Sagada Orange', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 13, name: 'Lemon Meyer', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 14, name: 'Kiat-kiat', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 15, name: 'Ponkan', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 16, name: 'Dalandan', price: 250, image: DEFAULT_PLANT_IMAGE }
        ],
        'Coconut': [
            { id: 17, name: 'Hybrid Coconut', price: 400, image: DEFAULT_PLANT_IMAGE },
            { id: 18, name: 'Native Coconut', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 19, name: 'Golden Coconut', price: 400, image: DEFAULT_PLANT_IMAGE },
            { id: 20, name: 'Dwarf Golden', price: 450, image: DEFAULT_PLANT_IMAGE },
            { id: 21, name: 'Macapuno', price: 500, image: DEFAULT_PLANT_IMAGE }
        ],
        'Mango': [
            { id: 22, name: 'Sweet Catimon Mango', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 23, name: 'Queen Mango', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 24, name: 'King Mango', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 25, name: 'Purple Mango', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 26, name: 'Indian Mango', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 27, name: 'Apple Mango', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 28, name: 'Carabao Mango', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 29, name: 'Golden queen mango', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 30, name: 'Florida mango', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 31, name: 'Double rootstock mango', price: 800, image: DEFAULT_PLANT_IMAGE }
        ],
        'Guava': [
            { id: 32, name: 'Guapple', price: 200, image: DEFAULT_PLANT_IMAGE },
            { id: 33, name: 'Red Guava', price: 200, image: DEFAULT_PLANT_IMAGE }
        ],
        'Grafted': [
            { id: 34, name: 'Mangosteen', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 35, name: 'Durian Puyat', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 36, name: 'Sweet Balimbing', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 37, name: 'Macpa red', price: 260, image: DEFAULT_PLANT_IMAGE },
            { id: 38, name: 'Hybrid Mulberry', price: 200, image: DEFAULT_PLANT_IMAGE },
            { id: 39, name: 'Guyabano', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 40, name: 'Abiu', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 41, name: 'Caimito', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 42, name: 'Atis', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 43, name: 'Atis Seedless', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 44, name: 'Langka', price: 200, image: DEFAULT_PLANT_IMAGE },
            { id: 45, name: 'Anonas', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 46, name: 'Chico', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 47, name: 'Cherrymoya', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 48, name: 'Bangkok Santol', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 49, name: 'Avocado', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 50, name: 'Giant Duhat', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 51, name: 'Kamias', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 52, name: 'Star Apple', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 53, name: 'Magic Fruit', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 54, name: 'Cacao', price: 200, image: DEFAULT_PLANT_IMAGE },
            { id: 55, name: 'Sweet Tamarind', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 56, name: 'Red Grapes', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 57, name: 'Lychee', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 58, name: 'Lanzones', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 59, name: 'Rambutan(RR)', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 60, name: 'Longgan', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 61, name: 'Kasoy', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 62, name: 'Marang', price: 250, image: DEFAULT_PLANT_IMAGE }
        ],
        'Forest': [
            { id: 63, name: 'Araucaria Trees', price: 500, image: DEFAULT_PLANT_IMAGE },
            { id: 64, name: 'Indian Tree', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 65, name: 'Mahogany', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 66, name: 'Pole Bamboo', price: 550, image: DEFAULT_PLANT_IMAGE },
            { id: 67, name: 'Thailand bamboo', price: 550, image: DEFAULT_PLANT_IMAGE },
            { id: 68, name: 'chinese bamboo', price: 550, image: DEFAULT_PLANT_IMAGE },
            { id: 69, name: 'african talisay', price: 400, image: DEFAULT_PLANT_IMAGE },
            { id: 70, name: 'royal palm', price: 600, image: DEFAULT_PLANT_IMAGE },
            { id: 71, name: 'bunga china', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 72, name: 'gemelina', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 73, name: 'narra', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 74, name: 'molave', price: 250, image: DEFAULT_PLANT_IMAGE }
        ],
        'Flowering': [
            { id: 75, name: 'golden trumpet', price: 700, image: DEFAULT_PLANT_IMAGE },
            { id: 76, name: 'pink trumpet', price: 800, image: DEFAULT_PLANT_IMAGE },
            { id: 77, name: 'Cherry blossom', price: 450, image: DEFAULT_PLANT_IMAGE },
            { id: 78, name: 'golden shower', price: 900, image: DEFAULT_PLANT_IMAGE },
            { id: 79, name: 'Fire tree', price: 1200, image: DEFAULT_PLANT_IMAGE },
            { id: 80, name: 'Ilang ilang', price: 700, image: DEFAULT_PLANT_IMAGE },
            { id: 81, name: 'Jacaranda', price: 1000, image: DEFAULT_PLANT_IMAGE },
            { id: 82, name: 'pine tree', price: 1200, image: DEFAULT_PLANT_IMAGE },
            { id: 83, name: 'palm tree', price: 1500, image: DEFAULT_PLANT_IMAGE },
            { id: 84, name: 'dates palm', price: 1500, image: DEFAULT_PLANT_IMAGE }
        ],
        'Cuttings': [
            { id: 85, name: 'Paminta', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 86, name: 'Micracle Fruit', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 87, name: 'Karamay', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 88, name: 'Sarguelas', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 89, name: 'Mabolo', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 90, name: 'Bignay', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 91, name: 'Robusta', price: 150, image: DEFAULT_PLANT_IMAGE },
            { id: 92, name: 'Arabica Coffee', price: 150, image: DEFAULT_PLANT_IMAGE },
            { id: 93, name: 'Barako', price: 150, image: DEFAULT_PLANT_IMAGE }
        ]
    };

    function defaultStockForPrice(price) {
        if (price >= 1500) return 4;
        if (price >= 800) return 8;
        if (price >= 500) return 12;
        if (price >= 300) return 18;
        return 25;
    }

    function clonePlant(plant) {
        return {
            id: String(plant.id),
            name: String(plant.name),
            category: String(plant.category),
            price: Number(plant.price) || 0,
            image: plant.image || DEFAULT_PLANT_IMAGE,
            stock: Math.max(0, Number(plant.stock) || 0),
            available: plant.available !== false
        };
    }

    function buildInitialInventory() {
        const flattened = [];
        Object.entries(MASTER_PLANTS_BY_CATEGORY).forEach(([category, items]) => {
            items.forEach(item => {
                flattened.push({
                    id: String(item.id),
                    name: item.name,
                    category,
                    price: item.price,
                    image: item.image || DEFAULT_PLANT_IMAGE,
                    stock: defaultStockForPrice(item.price),
                    available: true
                });
            });
        });
        return flattened;
    }

    function savePlantInventory(plants) {
        const safePlants = Array.isArray(plants) ? plants.map(clonePlant) : [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(safePlants));
    }

    function getPlantInventory() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            const seeded = buildInitialInventory();
            savePlantInventory(seeded);
            return seeded;
        }

        try {
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
                throw new Error('Inventory is not an array');
            }
            if (!parsed.length) {
                const seeded = buildInitialInventory();
                savePlantInventory(seeded);
                return seeded;
            }
            return parsed.map(clonePlant);
        } catch (error) {
            const seeded = buildInitialInventory();
            savePlantInventory(seeded);
            return seeded;
        }
    }

    function getPlantsByCategory() {
        const grouped = {};
        getPlantInventory().forEach(plant => {
            if (!grouped[plant.category]) {
                grouped[plant.category] = [];
            }
            grouped[plant.category].push(plant);
        });
        return grouped;
    }

    function getPlantById(id) {
        return getPlantInventory().find(plant => String(plant.id) === String(id)) || null;
    }

    function getPlantByName(name) {
        const normalized = String(name || '').trim().toLowerCase();
        return getPlantInventory().find(plant => plant.name.trim().toLowerCase() === normalized) || null;
    }

    function getEffectiveStock(plant) {
        if (!plant || !plant.available) return 0;
        return Math.max(0, Number(plant.stock) || 0);
    }

    function isInStock(plant) {
        return getEffectiveStock(plant) > 0;
    }

    function getStockLabel(plant) {
        const stock = getEffectiveStock(plant);
        if (stock <= 0) {
            return 'Out of Stock';
        }
        return stock === 1 ? '1 available' : stock + ' available';
    }

    if (!window.plantDataAPI) {
        window.plantDataAPI = {
            getPlantInventory,
            getPlantsByCategory,
            getPlantById,
            getPlantByName,
            getEffectiveStock,
            isInStock,
            getStockLabel,
            savePlantInventory,
            MASTER_PLANTS_BY_CATEGORY
        };
    }

    if (!window.GHPlantData) {
        window.GHPlantData = window.plantDataAPI;
    }
})(window);

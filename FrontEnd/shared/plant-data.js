(function initPlantData(window) {
    const STORAGE_KEY = 'gh_plant_inventory_v1';

    const DEFAULT_PLANT_IMAGE = 'https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

    const MASTER_PLANTS_BY_CATEGORY = {
        'Fruit Bearing': [
            { id: 1, name: 'Rambutan RR Tuklapin', price: 250, image: 'https://images.unsplash.com/photo-1609123079242-086695c6ff09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYW1idXRhbiUyMHRyb3BpY2FsJTIwZnJ1aXR8ZW58MXx8fHwxNzcyOTU0MTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 2, name: 'Mangosteen', price: 350, image: 'https://images.unsplash.com/photo-1706698352015-a907c7f8a445?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nb3N0ZWVuJTIwcHVycGxlJTIwZnJ1aXR8ZW58MXx8fHwxNzcyOTU0MTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 3, name: 'Lansones Longkong', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 4, name: 'Durian Puyat', price: 300, image: 'https://images.unsplash.com/photo-1630510526315-aba311212355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdXJpYW4lMjB0cm9waWNhbCUyMGZydWl0fGVufDF8fHx8MTc3Mjk1NDEyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 5, name: 'Sweet Tamarind', price: 250, image: 'https://images.unsplash.com/photo-1597081779002-314055fe24ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YW1hcmluZCUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 6, name: 'Bangkok Santol', price: 250, image: 'https://images.unsplash.com/photo-1737992468893-9c109da39f9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b2wlMjB0cm9waWNhbCUyMGZydWl0fGVufDF8fHx8MTc3Mjk1NDEyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 7, name: "Dian't Duhat", price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 8, name: 'Sweet Balimbing', price: 250, image: 'https://images.unsplash.com/photo-1760509614441-e9ca05cba0df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpbWJpbmclMjBzdGFyZnJ1aXQlMjB0cmVlfGVufDF8fHx8MTc3Mjk1NDEyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 9, name: 'Atis', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 10, name: 'Chico', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 11, name: 'Macopa Red', price: 260, image: DEFAULT_PLANT_IMAGE },
            { id: 12, name: 'Avocado Lagkitan', price: 350, image: 'https://images.unsplash.com/photo-1726177551991-270f9e79b65e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwdHJlZSUyMGdyZWVufGVufDF8fHx8MTc3Mjk1NDEyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 13, name: 'Cacao', price: 200, image: 'https://images.unsplash.com/photo-1625558904461-6cf9d0a18a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWNhbyUyMHRyZWUlMjBjaG9jb2xhdGV8ZW58MXx8fHwxNzcyOTU0MTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' }
        ],
        'Citrus Variety': [
            { id: 14, name: 'Japanese Orange', price: 300, image: 'https://images.unsplash.com/photo-1769968065899-832195e26d5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjaXRydXMlMjB0cmVlfGVufDF8fHx8MTc3Mjk1NDEyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 15, name: 'Davao Pomelo', price: 250, image: 'https://images.unsplash.com/photo-1655082291675-b919ca1c3419?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb21lbG8lMjBjaXRydXMlMjBmcnVpdHxlbnwxfHx8fDE3NzI5NTQxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 16, name: 'Satsuma Citrus', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 17, name: 'Dalanghita', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 18, name: 'Dayap', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 19, name: 'Calamansi', price: 200, image: 'https://images.unsplash.com/photo-1710425923077-1a7120a69eaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxhbWFuc2klMjBjaXRydXMlMjBsaW1lfGVufDF8fHx8MTc3Mjk1NDEyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 20, name: 'Kiat Kiat', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 21, name: 'Poncan', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 22, name: 'Lemon Meyer', price: 250, image: 'https://images.unsplash.com/photo-1585931158785-8e8b240c627f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW1vbiUyMG1leWVyJTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' }
        ],
        'Mangga Variety': [
            { id: 23, name: 'Carabao Manggo', price: 350, image: DEFAULT_PLANT_IMAGE },
            { id: 24, name: 'Queen Manggo', price: 350, image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 25, name: 'Sweet Catimon', price: 350, image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 26, name: 'Sweet Catimon Double Rootstock', price: 800, image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 27, name: 'Indian Manggo', price: 250, image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 28, name: 'King Manggo', price: 350, image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 29, name: 'Purple Manggo', price: 350, image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 30, name: 'Apple Manggo', price: 250, image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' }
        ],
        'Dwarf Coconut': [
            { id: 31, name: 'Golden', price: 400, image: 'https://images.unsplash.com/photo-1720798377880-2a1b656848ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwcGFsbSUyMGR3YXJmfGVufDF8fHx8MTc3Mjk1NDEyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 32, name: 'Tacunan Variety', price: 550, image: 'https://images.unsplash.com/photo-1720798377880-2a1b656848ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwcGFsbSUyMGR3YXJmfGVufDF8fHx8MTc3Mjk1NDEyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 33, name: 'Catigan Variety', price: 250, image: 'https://images.unsplash.com/photo-1720798377880-2a1b656848ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwcGFsbSUyMGR3YXJmfGVufDF8fHx8MTc3Mjk1NDEyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' }
        ],
        'Cuttings/Dwarf': [
            { id: 34, name: 'Red Guaple', price: 200, image: 'https://images.unsplash.com/photo-1689996647099-a7a0b67fd2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWF2YSUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 35, name: 'Green Guaple', price: 200, image: 'https://images.unsplash.com/photo-1689996647099-a7a0b67fd2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWF2YSUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 36, name: 'Marang', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 37, name: 'Lychee', price: 350, image: 'https://images.unsplash.com/photo-1705335834319-92a152363ea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxseWNoZWUlMjBmcnVpdCUyMHRyZWV8ZW58MXx8fHwxNzcyOTU0MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 38, name: 'Langka', price: 200, image: DEFAULT_PLANT_IMAGE },
            { id: 39, name: 'Hybrid Mulberry', price: 200, image: 'https://images.unsplash.com/photo-1711641011417-3162af1e834c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWxiZXJyeSUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 40, name: 'Paminta', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 41, name: 'Red Cardinal Grapes', price: 250, image: 'https://images.unsplash.com/photo-1660805376081-c6b01b7b78f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwZXMlMjB2aW5lJTIwZnJ1aXR8ZW58MXx8fHwxNzcyOTU0MTMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 42, name: 'Miracle Fruit', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 43, name: 'Magic Fruit', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 44, name: 'Sweet Guyabano', price: 300, image: 'https://images.unsplash.com/photo-1651565919334-bf81165cd0a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndXlhYmFubyUyMHNvdXJzb3AlMjBmcnVpdHxlbnwxfHx8fDE3NzI5NTQxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 45, name: 'Karamay', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 46, name: 'Sarguelas/Siniguelas', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 47, name: 'Abiu', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 48, name: 'Caimito', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 49, name: 'Mabolo', price: 300, image: DEFAULT_PLANT_IMAGE },
            { id: 50, name: 'Cacao', price: 200, image: 'https://images.unsplash.com/photo-1625558904461-6cf9d0a18a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWNhbyUyMHRyZWUlMjBjaG9jb2xhdGV8ZW58MXx8fHwxNzcyOTU0MTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 51, name: 'Kamias/Pias', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 52, name: 'Bignay', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 53, name: 'Pomegranate', price: 300, image: 'https://images.unsplash.com/photo-1761135174741-5507a710bb49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb21lZ3JhbmF0ZSUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 54, name: 'Longan', price: 300, image: 'https://images.unsplash.com/photo-1752368198532-4e5d4c892b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25nYW4lMjB0cm9waWNhbCUyMGZydWl0fGVufDF8fHx8MTc3Mjk1NDEzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' }
        ],
        'Flowering Trees': [
            { id: 55, name: 'Golden Trumpet', price: 700, image: 'https://images.unsplash.com/photo-1689790733141-9b4ef8ed1bc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjB0cnVtcGV0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 56, name: 'Pink Trumpet', price: 800, image: 'https://images.unsplash.com/photo-1760135638379-0e749e10c1b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwdHJ1bXBldCUyMGZsb3dlcnxlbnwxfHx8fDE3NzI5NTQxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 57, name: 'Golden Shower', price: 900, image: 'https://images.unsplash.com/photo-1683613791927-660d0ed2d86f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBzaG93ZXIlMjB0cmVlfGVufDF8fHx8MTc3Mjk1NDEzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 58, name: 'Fire Tree', price: 1200, image: 'https://images.unsplash.com/photo-1683356478048-ea3261e194b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXJlJTIwdHJlZSUyMGZsb3dlcmluZ3xlbnwxfHx8fDE3NzI5NTQxMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 59, name: 'Ilang Ilang', price: 700, image: 'https://images.unsplash.com/photo-1552017650-c117c3535f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5bGFuZyUyMHlsYW5nJTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 60, name: 'Jacaranda', price: 1000, image: 'https://images.unsplash.com/photo-1695389591261-ee471f900c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWNhcmFuZGElMjBwdXJwbGUlMjB0cmVlfGVufDF8fHx8MTc3Mjk1NDEzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 61, name: 'Pine Tree', price: 1200, image: 'https://images.unsplash.com/photo-1643550265302-a91ec947eb43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5lJTIwdHJlZSUyMGNvbmlmZXJ8ZW58MXx8fHwxNzcyOTU0MTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 62, name: 'Palm Tree', price: 1500, image: 'https://images.unsplash.com/photo-1761001826491-91409e63205a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxtJTIwdHJlZSUyMHRyb3BpY2FsfGVufDF8fHx8MTc3MjgyNzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 63, name: 'Dates Palm', price: 1500, image: 'https://images.unsplash.com/photo-1679219904448-30361b35773a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRlJTIwcGFsbSUyMHRyZWV8ZW58MXx8fHwxNzcyOTU0MTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 64, name: 'Dates Palm Bull Out', price: 5500, image: 'https://images.unsplash.com/photo-1679219904448-30361b35773a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRlJTIwcGFsbSUyMHRyZWV8ZW58MXx8fHwxNzcyOTU0MTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 65, name: 'Palawan Cherry Blossom 3ft', price: 450, image: 'https://images.unsplash.com/photo-1712725256207-e15286c6ede3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVycnklMjBibG9zc29tJTIwcGlua3xlbnwxfHx8fDE3NzI5NTQxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 66, name: 'Palawan Cherry Blossom Bull Out', price: 3500, image: 'https://images.unsplash.com/photo-1712725256207-e15286c6ede3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVycnklMjBibG9zc29tJTIwcGlua3xlbnwxfHx8fDE3NzI5NTQxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' }
        ],
        'Forest Trees': [
            { id: 67, name: 'Gemelina', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 68, name: 'Mahogany', price: 350, image: 'https://images.unsplash.com/photo-1544840281-274ae2755620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWhvZ2FueSUyMHRyZWUlMjB3b29kfGVufDF8fHx8MTc3Mjk1NDEzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 69, name: 'Narra', price: 350, image: 'https://images.unsplash.com/photo-1746311673824-69a17ad5672e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXJyYSUyMHRyZWUlMjBwaGlsaXBwaW5lfGVufDF8fHx8MTc3Mjk1NDEzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 70, name: 'Molave', price: 250, image: DEFAULT_PLANT_IMAGE },
            { id: 71, name: 'Pole Bamboo', price: 550, image: 'https://images.unsplash.com/photo-1696677049444-f695a0935b49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW1ib28lMjBmb3Jlc3QlMjBncmVlbnxlbnwxfHx8fDE3NzI5MDY2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 72, name: 'Thai Bamboo', price: 550, image: 'https://images.unsplash.com/photo-1696677049444-f695a0935b49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW1ib28lMjBmb3Jlc3QlMjBncmVlbnxlbnwxfHx8fDE3NzI5MDY2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' }
        ],
        'Others': [
            { id: 73, name: 'Arabica Coffee', price: 150, image: 'https://images.unsplash.com/photo-1689960686579-16b860f7c502?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBhcmFiaWNhJTIwcGxhbnR8ZW58MXx8fHwxNzcyOTU0MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 74, name: 'Robusta', price: 150, image: 'https://images.unsplash.com/photo-1689960686579-16b860f7c502?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBhcmFiaWNhJTIwcGxhbnR8ZW58MXx8fHwxNzcyOTU0MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            { id: 75, name: 'Barako', price: 150, image: 'https://images.unsplash.com/photo-1689960686579-16b860f7c502?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBhcmFiaWNhJTIwcGxhbnR8ZW58MXx8fHwxNzcyOTU0MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' }
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
            available: Boolean(plant.available)
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

    window.GHPlantData = {
        STORAGE_KEY,
        DEFAULT_PLANT_IMAGE,
        MASTER_PLANTS_BY_CATEGORY,
        getPlantInventory,
        savePlantInventory,
        getPlantsByCategory,
        getPlantById,
        getPlantByName,
        getEffectiveStock,
        isInStock,
        getStockLabel
    };
})(window);

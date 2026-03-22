// Default image for plants without specific photos
const DEFAULT_PLANT_IMAGE = "https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

// Plant data organized by category
const plantsByCategory = {
    "Fruit Bearing": [
        { id: 1, name: "Rambutan RR Tuklapin", price: 250, image: "https://images.unsplash.com/photo-1609123079242-086695c6ff09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYW1idXRhbiUyMHRyb3BpY2FsJTIwZnJ1aXR8ZW58MXx8fHwxNzcyOTU0MTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 2, name: "Mangosteen", price: 350, image: "https://images.unsplash.com/photo-1706698352015-a907c7f8a445?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nb3N0ZWVuJTIwcHVycGxlJTIwZnJ1aXR8ZW58MXx8fHwxNzcyOTU0MTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 3, name: "Lansones Longkong", price: 350, image: DEFAULT_PLANT_IMAGE },
        { id: 4, name: "Durian Puyat", price: 300, image: "https://images.unsplash.com/photo-1630510526315-aba311212355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdXJpYW4lMjB0cm9waWNhbCUyMGZydWl0fGVufDF8fHx8MTc3Mjk1NDEyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 5, name: "Sweet Tamarind", price: 250, image: "https://images.unsplash.com/photo-1597081779002-314055fe24ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YW1hcmluZCUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 6, name: "Bangkok Santol", price: 250, image: "https://images.unsplash.com/photo-1737992468893-9c109da39f9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b2wlMjB0cm9waWNhbCUyMGZydWl0fGVufDF8fHx8MTc3Mjk1NDEyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 7, name: "Dian't Duhat", price: 250, image: DEFAULT_PLANT_IMAGE },
        { id: 8, name: "Sweet Balimbing", price: 250, image: "https://images.unsplash.com/photo-1760509614441-e9ca05cba0df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpbWJpbmclMjBzdGFyZnJ1aXQlMjB0cmVlfGVufDF8fHx8MTc3Mjk1NDEyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 9, name: "Atis", price: 300, image: DEFAULT_PLANT_IMAGE },
        { id: 10, name: "Chico", price: 300, image: DEFAULT_PLANT_IMAGE },
        { id: 11, name: "Macopa Red", price: 260, image: DEFAULT_PLANT_IMAGE },
        { id: 12, name: "Avocado Lagkitan", price: 350, image: "https://images.unsplash.com/photo-1726177551991-270f9e79b65e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwdHJlZSUyMGdyZWVufGVufDF8fHx8MTc3Mjk1NDEyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 13, name: "Cacao", price: 200, image: "https://images.unsplash.com/photo-1625558904461-6cf9d0a18a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWNhbyUyMHRyZWUlMjBjaG9jb2xhdGV8ZW58MXx8fHwxNzcyOTU0MTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
    ],
    "Citrus Variety": [
        { id: 14, name: "Japanese Orange", price: 300, image: "https://images.unsplash.com/photo-1769968065899-832195e26d5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjaXRydXMlMjB0cmVlfGVufDF8fHx8MTc3Mjk1NDEyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 15, name: "Davao Pomelo", price: 250, image: "https://images.unsplash.com/photo-1655082291675-b919ca1c3419?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb21lbG8lMjBjaXRydXMlMjBmcnVpdHxlbnwxfHx8fDE3NzI5NTQxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 16, name: "Satsuma Citrus", price: 250, image: DEFAULT_PLANT_IMAGE },
        { id: 17, name: "Dalanghita", price: 250, image: DEFAULT_PLANT_IMAGE },
        { id: 18, name: "Dayap", price: 250, image: DEFAULT_PLANT_IMAGE },
        { id: 19, name: "Calamansi", price: 200, image: "https://images.unsplash.com/photo-1710425923077-1a7120a69eaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxhbWFuc2klMjBjaXRydXMlMjBsaW1lfGVufDF8fHx8MTc3Mjk1NDEyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 20, name: "Kiat Kiat", price: 300, image: DEFAULT_PLANT_IMAGE },
        { id: 21, name: "Poncan", price: 250, image: DEFAULT_PLANT_IMAGE },
        { id: 22, name: "Lemon Meyer", price: 250, image: "https://images.unsplash.com/photo-1585931158785-8e8b240c627f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW1vbiUyMG1leWVyJTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
    ],
    "Mangga Variety": [
        { id: 23, name: "Carabao Manggo", price: 350, image: DEFAULT_PLANT_IMAGE },
        { id: 24, name: "Queen Manggo", price: 350, image: "https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 25, name: "Sweet Catimon", price: 350, image: "https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 26, name: "Sweet Catimon Double Rootstock", price: 800, image: "https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 27, name: "Indian Manggo", price: 250, image: "https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 28, name: "King Manggo", price: 350, image: "https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 29, name: "Purple Manggo", price: 350, image: "https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 30, name: "Apple Manggo", price: 250, image: "https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHRyZWUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
    ],
    "Dwarf Coconut": [
        { id: 31, name: "Golden", price: 400, image: "https://images.unsplash.com/photo-1720798377880-2a1b656848ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwcGFsbSUyMGR3YXJmfGVufDF8fHx8MTc3Mjk1NDEyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 32, name: "Tacunan Variety", price: 550, image: "https://images.unsplash.com/photo-1720798377880-2a1b656848ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwcGFsbSUyMGR3YXJmfGVufDF8fHx8MTc3Mjk1NDEyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 33, name: "Catigan Variety", price: 250, image: "https://images.unsplash.com/photo-1720798377880-2a1b656848ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwcGFsbSUyMGR3YXJmfGVufDF8fHx8MTc3Mjk1NDEyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
    ],
    "Cuttings/Dwarf": [
        { id: 34, name: "Red Guaple", price: 200, image: "https://images.unsplash.com/photo-1689996647099-a7a0b67fd2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWF2YSUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 35, name: "Green Guaple", price: 200, image: "https://images.unsplash.com/photo-1689996647099-a7a0b67fd2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWF2YSUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 36, name: "Marang", price: 250, image: DEFAULT_PLANT_IMAGE },
        { id: 37, name: "Lychee", price: 350, image: "https://images.unsplash.com/photo-1705335834319-92a152363ea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxseWNoZWUlMjBmcnVpdCUyMHRyZWV8ZW58MXx8fHwxNzcyOTU0MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 38, name: "Langka", price: 200, image: DEFAULT_PLANT_IMAGE },
        { id: 39, name: "Hybrid Mulberry", price: 200, image: "https://images.unsplash.com/photo-1711641011417-3162af1e834c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWxiZXJyeSUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 40, name: "Paminta", price: 250, image: DEFAULT_PLANT_IMAGE },
        { id: 41, name: "Red Cardinal Grapes", price: 250, image: "https://images.unsplash.com/photo-1660805376081-c6b01b7b78f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwZXMlMjB2aW5lJTIwZnJ1aXR8ZW58MXx8fHwxNzcyOTU0MTMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 42, name: "Miracle Fruit", price: 300, image: DEFAULT_PLANT_IMAGE },
        { id: 43, name: "Magic Fruit", price: 300, image: DEFAULT_PLANT_IMAGE },
        { id: 44, name: "Sweet Guyabano", price: 300, image: "https://images.unsplash.com/photo-1651565919334-bf81165cd0a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndXlhYmFubyUyMHNvdXJzb3AlMjBmcnVpdHxlbnwxfHx8fDE3NzI5NTQxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 45, name: "Karamay", price: 300, image: DEFAULT_PLANT_IMAGE },
        { id: 46, name: "Sarguelas/Siniguelas", price: 300, image: DEFAULT_PLANT_IMAGE },
        { id: 47, name: "Abiu", price: 300, image: DEFAULT_PLANT_IMAGE },
        { id: 48, name: "Caimito", price: 250, image: DEFAULT_PLANT_IMAGE },
        { id: 49, name: "Mabolo", price: 300, image: DEFAULT_PLANT_IMAGE },
        { id: 50, name: "Cacao", price: 200, image: "https://images.unsplash.com/photo-1625558904461-6cf9d0a18a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWNhbyUyMHRyZWUlMjBjaG9jb2xhdGV8ZW58MXx8fHwxNzcyOTU0MTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 51, name: "Kamias/Pias", price: 250, image: DEFAULT_PLANT_IMAGE },
        { id: 52, name: "Bignay", price: 250, image: DEFAULT_PLANT_IMAGE },
        { id: 53, name: "Pomegranate", price: 300, image: "https://images.unsplash.com/photo-1761135174741-5507a710bb49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb21lZ3JhbmF0ZSUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 54, name: "Longan", price: 300, image: "https://images.unsplash.com/photo-1752368198532-4e5d4c892b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25nYW4lMjB0cm9waWNhbCUyMGZydWl0fGVufDF8fHx8MTc3Mjk1NDEzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
    ],
    "Flowering Trees": [
        { id: 55, name: "Golden Trumpet", price: 700, image: "https://images.unsplash.com/photo-1689790733141-9b4ef8ed1bc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjB0cnVtcGV0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 56, name: "Pink Trumpet", price: 800, image: "https://images.unsplash.com/photo-1760135638379-0e749e10c1b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwdHJ1bXBldCUyMGZsb3dlcnxlbnwxfHx8fDE3NzI5NTQxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 57, name: "Golden Shower", price: 900, image: "https://images.unsplash.com/photo-1683613791927-660d0ed2d86f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBzaG93ZXIlMjB0cmVlfGVufDF8fHx8MTc3Mjk1NDEzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 58, name: "Fire Tree", price: 1200, image: "https://images.unsplash.com/photo-1683356478048-ea3261e194b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXJlJTIwdHJlZSUyMGZsb3dlcmluZ3xlbnwxfHx8fDE3NzI5NTQxMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 59, name: "Ilang Ilang", price: 700, image: "https://images.unsplash.com/photo-1552017650-c117c3535f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5bGFuZyUyMHlsYW5nJTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 60, name: "Jacaranda", price: 1000, image: "https://images.unsplash.com/photo-1695389591261-ee471f900c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWNhcmFuZGElMjBwdXJwbGUlMjB0cmVlfGVufDF8fHx8MTc3Mjk1NDEzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 61, name: "Pine Tree", price: 1200, image: "https://images.unsplash.com/photo-1643550265302-a91ec947eb43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5lJTIwdHJlZSUyMGNvbmlmZXJ8ZW58MXx8fHwxNzcyOTU0MTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 62, name: "Palm Tree", price: 1500, image: "https://images.unsplash.com/photo-1761001826491-91409e63205a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxtJTIwdHJlZSUyMHRyb3BpY2FsfGVufDF8fHx8MTc3MjgyNzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 63, name: "Dates Palm", price: 1500, image: "https://images.unsplash.com/photo-1679219904448-30361b35773a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRlJTIwcGFsbSUyMHRyZWV8ZW58MXx8fHwxNzcyOTU0MTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 64, name: "Dates Palm Bull Out", price: 5500, image: "https://images.unsplash.com/photo-1679219904448-30361b35773a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRlJTIwcGFsbSUyMHRyZWV8ZW58MXx8fHwxNzcyOTU0MTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 65, name: "Palawan Cherry Blossom 3ft", price: 450, image: "https://images.unsplash.com/photo-1712725256207-e15286c6ede3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVycnklMjBibG9zc29tJTIwcGlua3xlbnwxfHx8fDE3NzI5NTQxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 66, name: "Palawan Cherry Blossom Bull Out", price: 3500, image: "https://images.unsplash.com/photo-1712725256207-e15286c6ede3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVycnklMjBibG9zc29tJTIwcGlua3xlbnwxfHx8fDE3NzI5NTQxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
    ],
    "Forest Trees": [
        { id: 67, name: "Gemelina", price: 250, image: DEFAULT_PLANT_IMAGE },
        { id: 68, name: "Mahogany", price: 350, image: "https://images.unsplash.com/photo-1544840281-274ae2755620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWhvZ2FueSUyMHRyZWUlMjB3b29kfGVufDF8fHx8MTc3Mjk1NDEzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 69, name: "Narra", price: 350, image: "https://images.unsplash.com/photo-1746311673824-69a17ad5672e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXJyYSUyMHRyZWUlMjBwaGlsaXBwaW5lfGVufDF8fHx8MTc3Mjk1NDEzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 70, name: "Molave", price: 250, image: DEFAULT_PLANT_IMAGE },
        { id: 71, name: "Pole Bamboo", price: 550, image: "https://images.unsplash.com/photo-1696677049444-f695a0935b49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW1ib28lMjBmb3Jlc3QlMjBncmVlbnxlbnwxfHx8fDE3NzI5MDY2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 72, name: "Thai Bamboo", price: 550, image: "https://images.unsplash.com/photo-1696677049444-f695a0935b49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW1ib28lMjBmb3Jlc3QlMjBncmVlbnxlbnwxfHx8fDE3NzI5MDY2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
    ],
    "Others": [
        { id: 73, name: "Arabica Coffee", price: 150, image: "https://images.unsplash.com/photo-1689960686579-16b860f7c502?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBhcmFiaWNhJTIwcGxhbnR8ZW58MXx8fHwxNzcyOTU0MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 74, name: "Robusta", price: 150, image: "https://images.unsplash.com/photo-1689960686579-16b860f7c502?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBhcmFiaWNhJTIwcGxhbnR8ZW58MXx8fHwxNzcyOTU0MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
        { id: 75, name: "Barako", price: 150, image: "https://images.unsplash.com/photo-1689960686579-16b860f7c502?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBhcmFiaWNhJTIwcGxhbnR8ZW58MXx8fHwxNzcyOTU0MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
    ],
};

// State management
let selectedPlant = null;

// Initialize the display
function init() {
    updatePlantDisplay();
    
    // Add event listeners
    document.getElementById('category').addEventListener('change', function() {
        selectedPlant = null;
        updatePlantDisplay();
    });
}

// Update plant display based on category selection
function updatePlantDisplay() {
    const category = document.getElementById('category').value;
    const displayArea = document.getElementById('plantDisplay');

    if (!category) {
        displayArea.innerHTML = `
            <div class="empty-state">
                <div class="empty-text">
                    Select a category to view available plants
                </div>
            </div>
        `;
        return;
    }

    const plants = plantsByCategory[category] || [];
    const plantsHTML = plants.map(plant => `
        <div class="plant-card ${selectedPlant && selectedPlant.id === plant.id ? 'selected' : ''}" 
             onclick="selectPlant(${plant.id}, '${category}')">
            <div class="plant-card-inner">
                <img src="${plant.image}" alt="${plant.name}" class="plant-image" 
                     onerror="this.src='${DEFAULT_PLANT_IMAGE}'">
                <div class="plant-info">
                    <div class="plant-name">${plant.name}</div>
                    <div class="plant-price">₱${plant.price.toFixed(2)}</div>
                </div>
                ${selectedPlant && selectedPlant.id === plant.id ? `
                    <div class="checkmark">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');

    displayArea.innerHTML = `<div class="plants-list">${plantsHTML}</div>`;
}

// Select a plant (toggle selection)
function selectPlant(plantId, category) {
    const plants = plantsByCategory[category];
    const plant = plants.find(p => p.id === plantId);
    
    // Toggle selection
    if (selectedPlant && selectedPlant.id === plantId) {
        selectedPlant = null;
    } else {
        selectedPlant = plant;
    }
    
    updatePlantDisplay();
}

// Handle reservation
function handleReserve() {
    const category = document.getElementById('category').value;
    const plantSize = document.getElementById('plantSize').value;
    const quantity = document.getElementById('quantity').value;
    const deliveryDate = document.getElementById('deliveryDate').value;

    if (!category || !plantSize || !quantity || !deliveryDate || !selectedPlant) {
        alert('Please fill in all fields and select a plant');
        return;
    }

    // Create reservation object
    const reservation = {
        category: category,
        plantSize: plantSize,
        quantity: parseInt(quantity),
        deliveryDate: deliveryDate,
        price: selectedPlant.price,
        name: selectedPlant.name,
    };

    // Store in localStorage
    const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    existingReservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(existingReservations));

    // Navigate to confirmation page
    window.location.href = 'confirmation.html';
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', init);

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
let selectedPlants = [];
const RESERVATION_PREFILL_KEY = 'reservationPrefillPlant';
const REQUIRED_CATEGORIES = ['Citrus', 'Coconut', 'Cuttings', 'Flowering', 'Forest', 'Grafted', 'Guava', 'Mango'];
let backendPlantsByCategory = null;
const RESERVATION_TOAST_DURATION = 1800;

let reservationRedirectTimeout = null;
let reservationToastHideTimeout = null;
let reservationToastRemoveTimeout = null;
let isReservationRedirecting = false;

const GH_CATEGORY_BY_UI_CATEGORY = {
    'Citrus Variety': 'Citrus',
    'Mangga Variety': 'Mango',
    'Dwarf Coconut': 'Coconut',
    'Cuttings/Dwarf': 'Cuttings',
    'Flowering Trees': 'Flowering',
    'Forest Trees': 'Forest'
};

function getReservationToastRegion() {
    return document.getElementById('reservationToastRegion');
}

function getReserveButton() {
    return document.querySelector('.reserve-btn');
}

function showReservationSuccessToast() {
    const toastRegion = getReservationToastRegion();
    if (!toastRegion) {
        return;
    }

    window.clearTimeout(reservationToastHideTimeout);
    window.clearTimeout(reservationToastRemoveTimeout);

    toastRegion.innerHTML = '';

    const toast = document.createElement('section');
    toast.className = 'reservation-success-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
        <div class="reservation-success-toast-badge" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
                <path d="M7 12.5L10.1 15.6L17.25 8.45" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <div class="reservation-success-toast-copy">
            <p class="reservation-success-toast-title">Reservation saved</p>
            <p class="reservation-success-toast-text">Your plants were reserved successfully. Opening reserved plants...</p>
        </div>
        <div class="reservation-success-toast-progress"></div>
    `;

    toastRegion.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('is-visible');
        const progressBar = toast.querySelector('.reservation-success-toast-progress');
        if (progressBar) {
            progressBar.style.animation = `reservationToastCountdown ${RESERVATION_TOAST_DURATION}ms linear forwards`;
        }
    });

    reservationToastHideTimeout = window.setTimeout(() => {
        toast.classList.remove('is-visible');
        reservationToastRemoveTimeout = window.setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 220);
    }, RESERVATION_TOAST_DURATION);
}

function normalizeText(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function mapToRequiredCategory(categoryName) {
    const normalized = normalizeText(categoryName);
    if (!normalized) {
        return '';
    }

    const exact = REQUIRED_CATEGORIES.find((name) => normalizeText(name) === normalized);
    if (exact) {
        return exact;
    }

    if (normalized.includes('citrus')) return 'Citrus';
    if (normalized.includes('coconut')) return 'Coconut';
    if (normalized.includes('cutting')) return 'Cuttings';
    if (normalized.includes('flower')) return 'Flowering';
    if (normalized.includes('forest')) return 'Forest';
    if (normalized.includes('graft')) return 'Grafted';
    if (normalized.includes('guava') || normalized.includes('guapple')) return 'Guava';
    if (normalized.includes('mango') || normalized.includes('mangga')) return 'Mango';

    return '';
}

function populateCategoryChoices() {
    const categoryField = document.getElementById('category');
    if (!categoryField) {
        return;
    }

    categoryField.innerHTML = '<option value="">Category</option>' + REQUIRED_CATEGORIES
        .map((category) => `<option value="${category}">${category}</option>`)
        .join('');
}

async function loadBackendPlants() {
    try {
        const [plants, categories, sizes] = await Promise.all([
            plantsAPI.getAll(),
            categoriesAPI.getAll(),
            plantSizesAPI.getAll()
        ]);

        const categoryIdToName = {};
        if (Array.isArray(categories)) {
            categories.forEach((category) => {
                categoryIdToName[category.category_id] = category.category_name || category.name || '';
            });
        }

        const sizeMap = {};
        if (Array.isArray(sizes)) {
            sizes.forEach((size) => {
                const plantId = size.plant_id;
                if (!plantId) {
                    return;
                }

                if (!sizeMap[plantId]) {
                    sizeMap[plantId] = [];
                }

                sizeMap[plantId].push({
                    sizeName: String(size.size_name || '').trim(),
                    price: Number(size.price) || 0,
                    stock: Number(size.stock_quantity) || 0
                });
            });
        }

        const grouped = REQUIRED_CATEGORIES.reduce((acc, category) => {
            acc[category] = [];
            return acc;
        }, {});

        if (Array.isArray(plants)) {
            plants.forEach((plant) => {
                const rawCategory = categoryIdToName[plant.category_id] || '';
                const requiredCategory = mapToRequiredCategory(rawCategory);
                if (!requiredCategory) {
                    return;
                }

                const plantSizes = sizeMap[plant.plant_id] || [];
                const stock = plantSizes.reduce((sum, s) => sum + Number(s.stock || 0), 0);
                const priced = plantSizes.filter((s) => Number(s.price) > 0);
                const price = priced.length ? Math.min(...priced.map((s) => s.price)) : 0;
                const sizeOptions = [...new Set(plantSizes.map((s) => s.sizeName).filter(Boolean))];

                const parsedImages = (window.GHPlantData && typeof window.GHPlantData.resolvePlantImagesById === 'function')
                    ? window.GHPlantData.resolvePlantImagesById(plant.plant_id, plant.image_path || plant.image || DEFAULT_PLANT_IMAGE)
                    : [plant.image_path || plant.image || DEFAULT_PLANT_IMAGE];

                grouped[requiredCategory].push({
                    id: plant.plant_id,
                    name: plant.plant_name,
                    price,
                    image: parsedImages[0] || DEFAULT_PLANT_IMAGE,
                    stock,
                    sizeOptions
                });
            });
        }

        backendPlantsByCategory = grouped;
    } catch (error) {
        console.error('Failed to load reservation plants from backend:', error);
        backendPlantsByCategory = {};
    }
}

function getLocalPlantsByCategory() {
    return plantsByCategory;
}

function getSourcePlantsByCategory() {
    if (backendPlantsByCategory && Object.keys(backendPlantsByCategory).length) {
        return backendPlantsByCategory;
    }
    return getLocalPlantsByCategory();
}

function resolveReservationCategory(category) {
    if (!category) {
        return '';
    }

    const mappedCategory = mapToRequiredCategory(category);
    if (mappedCategory) {
        return mappedCategory;
    }

    const normalizedCategory = normalizeText(category);
    const exactMatch = REQUIRED_CATEGORIES.find((name) => normalizeText(name) === normalizedCategory);
    if (exactMatch) {
        return exactMatch;
    }

    return category;
}

function findPlantByIdAcrossSource(plantId) {
    const sourceByCategory = getSourcePlantsByCategory();
    for (const [category, plants] of Object.entries(sourceByCategory)) {
        if (!Array.isArray(plants)) {
            continue;
        }

        const found = plants.find((plant) => String(plant.id) === String(plantId));
        if (found) {
            return { plant: found, category };
        }
    }
    return null;
}

function findLocalCategoryForRequestedCategory(category) {
    const normalizedTarget = normalizeText(category);
    const match = Object.entries(GH_CATEGORY_BY_UI_CATEGORY).find(([, requiredCategory]) => {
        return normalizeText(requiredCategory) === normalizedTarget;
    });
    return match ? match[0] : '';
}

function getPlantsForCategory(category) {
    const backendSource = backendPlantsByCategory || {};
    const localSource = getLocalPlantsByCategory();
    if (!category) {
        return [];
    }

    const normalizedResolved = resolveReservationCategory(category);
    const localFallbackCategory = findLocalCategoryForRequestedCategory(category);
    const normalizedCategory = normalizeText(category);
    const directMatch = REQUIRED_CATEGORIES.find((name) => normalizeText(name) === normalizedCategory);

    const candidateKeys = [category];
    if (normalizedResolved && !candidateKeys.includes(normalizedResolved)) {
        candidateKeys.push(normalizedResolved);
    }
    if (localFallbackCategory && !candidateKeys.includes(localFallbackCategory)) {
        candidateKeys.push(localFallbackCategory);
    }
    if (directMatch && !candidateKeys.includes(directMatch)) {
        candidateKeys.push(directMatch);
    }

    for (const key of candidateKeys) {
        if (Array.isArray(backendSource[key]) && backendSource[key].length) {
            return backendSource[key];
        }
    }

    for (const key of candidateKeys) {
        if (Array.isArray(localSource[key]) && localSource[key].length) {
            return localSource[key];
        }
    }

    return [];
}

function getAllSourcePlants() {
    return Object.values(getSourcePlantsByCategory() || {}).flat();
}

function getAvailableStock(plant) {
    const stockValue = Number(plant?.stock);
    const localStock = Number.isFinite(stockValue) ? Math.max(0, stockValue) : null;

    if (localStock !== null) {
        return localStock;
    }

    if (window.GHPlantData && typeof window.GHPlantData.getPlantById === 'function') {
        const ghPlant = window.GHPlantData.getPlantById(plant.id);
        if (ghPlant) {
            const stock = window.GHPlantData.getEffectiveStock(ghPlant);
            return Math.max(0, Number(stock) || 0);
        }
    }

    return 0;
}

function getSizeOptionsForPlant(plant) {
    if (Array.isArray(plant?.sizeOptions) && plant.sizeOptions.length) {
        return plant.sizeOptions;
    }

    return ['Medium', 'XL'];
}

function isPlantAvailable(plant) {
    return getAvailableStock(plant) > 0;
}

function getSelectedPlant(id) {
    return selectedPlants.find(p => String(p.id) === String(id));
}

function openCalendar() {
    const dateEl = document.getElementById('deliveryDate');
    if (!dateEl) return;

    if (typeof dateEl.showPicker === 'function') {
        dateEl.showPicker();
    } else {
        dateEl.focus();
        dateEl.click();
    }
}

function removeSelectedPlant(id) {
    selectedPlants = selectedPlants.filter(p => String(p.id) !== String(id));
}

function updateSelectedPlant(id, patch) {
    const selected = getSelectedPlant(id);
    if (selected) {
        Object.assign(selected, patch);
    }
}

function handlePlantSelectionClick(event) {
    const clickedControl = event.target.closest('.plant-controls');
    if (clickedControl) {
        return;
    }

    const clickedCard = event.target.closest('.plant-card');
    if (!clickedCard) {
        return;
    }

    if (clickedCard.classList.contains('unavailable')) {
        return;
    }

    const plantId = Number(clickedCard.dataset.plantId);
    const category = clickedCard.dataset.category;

    if (!plantId || !category) {
        return;
    }

    selectPlant(plantId, category);
}

function normalizePrefillSize(size) {
    const value = String(size || '').toLowerCase();
    if (value === 'xl' || value === 'extra large' || value === 'extra large (xl)') {
        return 'XL';
    }
    if (value === 'medium') {
        return 'Medium';
    }
    return '';
}

function applyReservationPrefill() {
    const raw = localStorage.getItem(RESERVATION_PREFILL_KEY);
    if (!raw) {
        return;
    }

    let prefill = null;
    try {
        prefill = JSON.parse(raw);
    } catch (error) {
        localStorage.removeItem(RESERVATION_PREFILL_KEY);
        return;
    }

    if (!prefill || !prefill.id) {
        localStorage.removeItem(RESERVATION_PREFILL_KEY);
        return;
    }

    const categoryField = document.getElementById('category');
    const resolvedCategory = resolveReservationCategory(prefill.category || '');
    let categoryPlants = getPlantsForCategory(resolvedCategory);
    let matchedPlant = categoryPlants.find(plant => String(plant.id) === String(prefill.id));
    let finalCategory = resolvedCategory;

    if (!matchedPlant) {
        const found = findPlantByIdAcrossSource(prefill.id);
        if (found && isPlantAvailable(found.plant)) {
            matchedPlant = found.plant;
            finalCategory = resolveReservationCategory(found.category);
            categoryPlants = getPlantsForCategory(finalCategory);
        }
    }

    if (!matchedPlant || !isPlantAvailable(matchedPlant)) {
        localStorage.removeItem(RESERVATION_PREFILL_KEY);
        return;
    }

    if (categoryField) {
        const displayCategory = resolveReservationCategory(finalCategory) || finalCategory;
        const hasOption = Array.from(categoryField.options).some((opt) => opt.value === displayCategory);
        if (!hasOption) {
            const fallback = Array.from(categoryField.options).find((opt) => normalizeText(opt.value) === normalizeText(displayCategory));
            if (fallback) {
                categoryField.value = fallback.value;
            } else {
                categoryField.value = resolvedCategory || '';
            }
        } else {
            categoryField.value = displayCategory;
        }
        finalCategory = categoryField.value || displayCategory;
    }

    const maxStock = Math.max(1, getAvailableStock(matchedPlant));
    const qty = Math.min(maxStock, Math.max(1, parseInt(prefill.quantity, 10) || 1));
    const size = normalizePrefillSize(prefill.size);

    removeSelectedPlant(prefill.id);
    selectedPlants.push({
        ...matchedPlant,
        category: finalCategory,
        quantity: qty,
        size: size
    });

    updatePlantDisplay();

    const prefilledCard = document.querySelector(`.plant-card[data-plant-id="${prefill.id}"]`);
    if (prefilledCard) {
        prefilledCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    localStorage.removeItem(RESERVATION_PREFILL_KEY);
}

function initializeStickyHeaderBlur() {
    const header = document.querySelector('.header');
    if (!header) {
        return;
    }

    function syncHeaderState() {
        header.classList.toggle('is-scrolled', window.scrollY > 10);
    }

    syncHeaderState();
    window.addEventListener('scroll', syncHeaderState, { passive: true });
}

// Initialize the display
async function init() {
    const categoryField = document.getElementById('category');
    const plantDisplay = document.getElementById('plantDisplay');

    initializeStickyHeaderBlur();

    populateCategoryChoices();
    await loadBackendPlants();

    updatePlantDisplay();

    categoryField.addEventListener('change', function() {
        updatePlantDisplay();
    });

    plantDisplay.addEventListener('click', handlePlantSelectionClick);

    applyReservationPrefill();
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


    const allPlants = getPlantsForCategory(category);
    // Limit to maximum 8 plants per category to reduce scrolling
    const plants = allPlants.slice(0, 8);

    if (!plants.length) {
        displayArea.innerHTML = `
            <div class="empty-state">
                <div class="empty-text">
                    No plants available yet under ${category}.
                </div>
            </div>
        `;
        return;
    }

    const plantsHTML = plants.map(plant => {
        const selectedPlantData = getSelectedPlant(plant.id);
        const isSelected = Boolean(selectedPlantData);
        const maxStock = getAvailableStock(plant);
        const isAvailable = isPlantAvailable(plant);
        const plantQty = selectedPlantData ? Math.min(selectedPlantData.quantity, Math.max(1, maxStock)) : 1;
        const plantSize = selectedPlantData ? selectedPlantData.size : '';
        const sizeOptions = getSizeOptionsForPlant(plant);
        const sizeOptionsHtml = sizeOptions
            .map((size) => `<option value="${size}" ${plantSize === size ? 'selected' : ''}>${size}</option>`)
            .join('');

        return `
        <div class="plant-card ${isSelected ? 'selected' : ''} ${isAvailable ? '' : 'unavailable'}" data-plant-id="${plant.id}" data-category="${category}">
            <div class="plant-card-inner">
                <button
                    type="button"
                    class="plant-select-circle ${isSelected ? 'selected' : ''}"
                    aria-label="${isSelected ? 'Unselect' : 'Select'} ${plant.name}"
                    aria-pressed="${isSelected ? 'true' : 'false'}"
                    ${isAvailable ? '' : 'disabled'}
                >
                    <span class="plant-select-circle-mark">
                        ${isSelected ? `
                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                            </svg>
                        ` : ''}
                    </span>
                </button>
                <img src="${plant.image}" alt="${plant.name}" class="plant-image" onerror="this.src='${DEFAULT_PLANT_IMAGE}'">
                <div class="plant-info">
                    <div class="plant-name">${plant.name}</div>
                    <div class="plant-price">₱${plant.price.toFixed(2)}</div>
                    <div class="plant-stock ${isAvailable ? 'in' : 'out'}">${isAvailable ? `${maxStock} available` : 'Out of Stock'}</div>
                    <div class="plant-controls">
                        <label for="qty-${plant.id}" class="plant-quantity-label">Qty:</label>
                        <input
                            id="qty-${plant.id}"
                            class="plant-quantity"
                            type="number"
                            min="1"
                            max="${Math.max(1, maxStock)}"
                            value="${plantQty}"
                            ${isAvailable ? '' : 'disabled'}
                            onchange="onPlantQuantityChange(${plant.id}, this.value)"
                        />
                        <label for="size-${plant.id}" class="plant-size-label">Size:</label>
                        <select id="size-${plant.id}" class="plant-size" ${isAvailable ? '' : 'disabled'} onchange="onPlantSizeChange(${plant.id}, this.value)">
                            <option value="">Select</option>
                            ${sizeOptionsHtml}
                        </select>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');

    displayArea.innerHTML = `<div class="plants-list">${plantsHTML}</div>`;
}


// Called when quantity input changes on a plant card
function onPlantQuantityChange(plantId, value) {
    const matchingPlant = getAllSourcePlants().find(plant => String(plant.id) === String(plantId));
    const maxStock = matchingPlant ? Math.max(1, getAvailableStock(matchingPlant)) : 99;
    const qty = Math.min(maxStock, Math.max(1, parseInt(value, 10) || 1));
    const selected = getSelectedPlant(plantId);
    if (selected) {
        selected.quantity = qty;
    }
}

// Called when size select changes on a plant card
function onPlantSizeChange(plantId, size) {
    const selected = getSelectedPlant(plantId);
    if (selected) {
        selected.size = size;
    }
}

// Select/deselect plant (multi-select support)
function selectPlant(plantId, category) {
    const currentScrollY = window.scrollY;
    const plantsList = document.querySelector('.plants-list');
    const currentListScrollTop = plantsList ? plantsList.scrollTop : 0;
    const plants = getPlantsForCategory(category);
    const plant = plants.find(p => String(p.id) === String(plantId));
    if (!plant) return;
    if (!isPlantAvailable(plant)) return;

    const existing = getSelectedPlant(plantId);
    if (existing) {
        // Unselect
        removeSelectedPlant(plantId);
    } else {
        // Add selected plant with current fields
        const qtyInput = document.getElementById(`qty-${plantId}`);
        const sizeInput = document.getElementById(`size-${plantId}`);
        const maxStock = Math.max(1, getAvailableStock(plant));
        const qty = qtyInput ? Math.min(maxStock, Math.max(1, parseInt(qtyInput.value, 10) || 1)) : 1;
        const size = sizeInput ? sizeInput.value : '';

        selectedPlants.push({
            ...plant,
            category,
            quantity: qty,
            size: size
        });
    }

    updatePlantDisplay();
    const updatedPlantsList = document.querySelector('.plants-list');
    if (updatedPlantsList) {
        updatedPlantsList.scrollTop = currentListScrollTop;
    }
    window.scrollTo(0, currentScrollY);
}


// Handle reservation
function handleReserve() {
    if (isReservationRedirecting) {
        return;
    }

    const selectedCategory = document.getElementById('category').value;
    const deliveryDate = document.getElementById('deliveryDate').value;

    if (!selectedCategory) {
        alert('Please select a category.');
        return;
    }

    if (selectedPlants.length === 0) {
        alert('Please select a Plant.');
        return;
    }

    if (!deliveryDate) {
        alert('Please select a date.');
        return;
    }

    // Validate each selected plant has size and valid quantity
    for (const plant of selectedPlants) {
        const stockCheckedPlant = plant;
        const latestAvailable = isPlantAvailable(stockCheckedPlant);
        const latestStock = getAvailableStock(stockCheckedPlant);

        if (!latestAvailable) {
            alert(`${plant.name} is out of stock.`);
            return;
        }
        if (!plant.size) {
            alert(`Please choose size for ${plant.name}.`);
            return;
        }
        if (!plant.quantity || plant.quantity < 1) {
            alert(`Please choose quantity 1 or more for ${plant.name}.`);
            return;
        }
        if (plant.quantity > latestStock) {
            alert(`${plant.name} only has ${latestStock} stock available.`);
            return;
        }
    }

    const newReservations = selectedPlants.map(plant => ({
        category: plant.category,
        plantSize: plant.size,
        quantity: parseInt(plant.quantity, 10),
        deliveryDate,
        price: plant.price,
        name: plant.name,
        id: plant.id,
        image: plant.image || DEFAULT_PLANT_IMAGE,
        isPlacedOrder: false
    }));

    const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');

    newReservations.forEach(newItem => {
        const existingItem = existingReservations.find(item =>
            item.id === newItem.id &&
            item.deliveryDate === newItem.deliveryDate &&
            item.plantSize === newItem.plantSize
        );

        if (existingItem) {
            existingItem.quantity += newItem.quantity;
            return;
        }

        existingReservations.push(newItem);
    });

    localStorage.setItem('reservations', JSON.stringify(existingReservations));

    if (window.GHPlantData) {
        const inventory = window.GHPlantData.getPlantInventory();
        selectedPlants.forEach(selectedPlant => {
            const item = inventory.find(plant => String(plant.id) === String(selectedPlant.id));
            if (!item) return;
            item.stock = Math.max(0, (Number(item.stock) || 0) - Number(selectedPlant.quantity || 0));
            if (item.stock === 0) {
                item.available = false;
            }
        });
        window.GHPlantData.savePlantInventory(inventory);
    }

    localStorage.removeItem('deliveryDetails');
    isReservationRedirecting = true;

    const reserveButton = getReserveButton();
    if (reserveButton) {
        reserveButton.disabled = true;
        reserveButton.textContent = 'Reserving...';
    }

    showReservationSuccessToast();

    window.clearTimeout(reservationRedirectTimeout);
    reservationRedirectTimeout = window.setTimeout(() => {
        window.location.href = 'reserved-plants.html';
    }, RESERVATION_TOAST_DURATION);
}


// Initialize when page loads
window.addEventListener('DOMContentLoaded', init);
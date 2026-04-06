(function () {
    const PRICE_BY_NAME = {
        'Hybrid Coconut': 400,
        'Native Coconut': 350,
        'Golden Coconut': 400,
        'Macapuno': 450,
        'Sweet Catimon Mango': 350,
        'Indian Mango': 250,
        'Apple Mango': 250,
        'Carabao Mango': 350,
        'Golden Queen Mango': 350,
        'Florida Mango': 300,
        'Double Rootstock Mango': 800,
        'Guapple': 200,
        'Red Guava': 200,
        'Yellow Lemon': 250,
        'American Lemon': 250,
        'Dayap': 250,
        'Pomegranate': 300,
        'Calamansi': 200,
        'Suha Davao': 250,
        'Calamandarin': 250,
        'Sagada Orange': 300,
        'Kiat-kiat': 300,
        'Ponkan': 250,
        'Dalandan': 250,
        'Mangosteen': 350,
        'Mulberry': 200,
        'Guyabano': 300,
        'Atis': 300,
        'Atis Seedless': 300,
        'Langka': 200,
        'Anonas': 300,
        'Chico': 300,
        'Cherrymoya': 300,
        'Bangkok Santol': 250,
        'Avocado': 350,
        'Giant Duhat': 250,
        'Kamias': 250,
        'Star Apple': 250,
        'Magic Fruit': 300,
        'Cacao': 200,
        'Sweet Tamarind': 250,
        'Red Grapes': 250,
        'Lychee': 350,
        'Lanzones': 350,
        'Rambutan (RR)': 250,
        'Longgan': 300,
        'Kasoy': 250,
        'Marang': 250,
        'Araucaria Trees': 450,
        'Indian Tree': 350,
        'Mahogany': 350,
        'Thailand Bamboo': 550,
        'Chinese Bamboo': 550,
        'African Talisay': 350,
        'Royal Palm': 1500,
        'Bunga China': 350,
        'Gemelina': 250,
        'Narra': 350,
        'Molave': 250,
        'Golden Trumpet': 700,
        'Pink Trumpet': 800,
        'Cherry Blossom': 450,
        'Golden Shower': 900,
        'Fire Tree': 1200,
        'Ilang Ilang': 700,
        'Jacaranda': 1000,
        'Pine Tree': 1200,
        'Palm Tree': 1500,
        'Dates Palm': 1500
    };

    function deriveCategory() {
        const heading = document.querySelector('.wrap h1');
        const raw = (heading ? heading.textContent : '') || 'Category';
        return raw.replace(/\s+Variety$/i, '').replace(/\s+Trees$/i, '').trim();
    }

    function buildProductDetailUrl(name, category, image, price) {
        const params = new URLSearchParams({
            name: name,
            category: category,
            image: image,
            price: String(price)
        });

        return '../product-detail.html?' + params.toString();
    }

    function applyCategoryLinks() {
        const cards = document.querySelectorAll('.grid .card');
        if (!cards.length) {
            return;
        }

        const category = deriveCategory();

        cards.forEach(function (card) {
            const name = (card.querySelector('.name')?.textContent || '').trim();
            const image = card.querySelector('img')?.getAttribute('src') || '';

            if (!name || !image) {
                return;
            }

            const price = PRICE_BY_NAME[name] || 250;
            card.setAttribute('href', buildProductDetailUrl(name, category, image, price));
        });
    }

    document.addEventListener('DOMContentLoaded', applyCategoryLinks);
})();

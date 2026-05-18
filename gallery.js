// SUPABASE CONFIGURATION
const supabaseUrl = 'https://cvdlqhjkcgbjezqixsci.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZGxxaGprY2diamV6cWl4c2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NTYwMjMsImV4cCI6MjA5NDQzMjAyM30.msfkqmZiyveV4JOJVyk1EuhOfxwbqrrXyMLFlhi2o1U';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

let galleryItems = [];
let currentFilter = 'all';

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadGalleryFromSupabase();
});

async function loadGalleryFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        if (data && data.length > 0) {
            galleryItems = data;
        } else {
            galleryItems = [];
        }
        
        renderGallery();
        

    } catch (error) {
        console.error('Error loading gallery:', error);
        galleryItems = [];
        renderGallery();
    }
}

// SETUP EVENT LISTENERS
function setupEventListeners() {
    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderGallery();
        });
    });
}

// RENDER GALLERY
function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';

    const filteredItems = currentFilter === 'all' 
        ? galleryItems 
        : galleryItems.filter(item => item.category === currentFilter);

    filteredItems.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="gallery-card-image">
            <div class="gallery-card-overlay">
                <div class="gallery-card-content">
                    <h3 class="gallery-card-title">${item.title}</h3>
                    <p class="gallery-card-category">${item.category}</p>
                    <button class="gallery-card-view-btn" onclick="openLightbox(${item.id})">View</button>
                </div>
            </div>
        `;

        card.addEventListener('click', () => openLightbox(item.id));
        
        setTimeout(() => {
            card.classList.add('show');
        }, 10);

        galleryGrid.appendChild(card);
    });
}

// LIGHTBOX FUNCTIONS
function openLightbox(itemId) {
    const item = galleryItems.find(i => i.id === itemId);
    if (item) {
        document.getElementById('lightboxImage').src = item.image;
        document.getElementById('lightboxTitle').textContent = item.title;
        document.getElementById('lightboxDesc').textContent = item.description;
        document.getElementById('lightboxModal').classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox(event) {
    if (event && event.type === 'click' && event.target !== document.getElementById('lightboxModal')) {
        return;
    }
    document.getElementById('lightboxModal').classList.remove('open');
    document.body.style.overflow = 'auto';
}

// SCROLL TO TOP
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// TERMS MODAL
function openTerms(event) {
    if (event) {
        event.preventDefault();
    }
    const termsModal = document.getElementById('termsModal');
    termsModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeTerms(event) {
    if (event && event.type === 'click' && event.target !== document.getElementById('termsModal')) {
        return;
    }
    const termsModal = document.getElementById('termsModal');
    termsModal.classList.remove('open');
    document.body.style.overflow = 'auto';
}

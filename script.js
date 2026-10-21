// ==========================================
// 1. DATA DUMMY JURNAL (Database Tiruan)
// ==========================================
const journalsData = [
    {
        id: 1,
        title: "Penerapan Algoritma Deep Learning dalam Deteksi Dini Penyakit Jantung",
        author: "Budi Santoso, Rina Wijaya",
        year: 2024,
        citations: 42,
        topic: "AI",
        abstract: "Penelitian ini mengusung model CNN untuk menganalisis data EKG pasien secara real-time. Hasil akurasi menunjukkan peningkatan hingga 94.5% dibanding metode konvensional.",
        citation: "Santoso, B., & Wijaya, R. (2024). Penerapan Algoritma Deep Learning dalam Deteksi Dini Penyakit Jantung. Jurnal Teknologi Informasi, 12(1), 45-58."
    },
    {
        id: 2,
        title: "Analisis Performa Framework React vs Vue pada Aplikasi Web Skala Besar",
        author: "Siti Rahmawati",
        year: 2023,
        citations: 89,
        topic: "Web",
        abstract: "Studi komparatif ini mengukur Virtual DOM rendering time dan alokasi memori browser dari dua framework JavaScript populer pada skenario beban tinggi.",
        citation: "Rahmawati, S. (2023). Analisis Performa Framework React vs Vue pada Aplikasi Web Skala Besar. Jurnal Sistem Informasi, 8(2), 112-120."
    },
    {
        id: 3,
        title: "Optimasi Big Data Menggunakan Spark untuk Prediksi Tren Pasar",
        author: "Ahmad Rizky, Dewi Lestari",
        year: 2024,
        citations: 15,
        topic: "Data",
        abstract: "Pengolahan jutaan data transaksi e-commerce dilakukan dengan Apache Spark untuk memprediksi perilaku belanja pengguna secara presisi.",
        citation: "Rizky, A., & Lestari, D. (2024). Optimasi Big Data Menggunakan Spark untuk Prediksi Tren Pasar. Data Science Journal, 5(3), 88-101."
    },
    {
        id: 4,
        title: "Deteksi Intrusik Jaringan Menggunakan Machine Learning pada IoT",
        author: "Fajar Nugraha",
        year: 2022,
        citations: 120,
        topic: "Cybersecurity",
        abstract: "Sistem keamanan siber otomatis berbasis Random Forest untuk mencegah serangan DDoS pada perangkat Smart Home.",
        citation: "Nugraha, F. (2022). Deteksi Intrusik Jaringan Menggunakan Machine Learning pada IoT. Jurnal Keamanan Siber, 4(1), 10-25."
    },
    {
        id: 5,
        title: "Implementasi Progressive Web Apps (PWA) untuk Media Pembelajaran Kampus",
        author: "Dian Pratama",
        year: 2023,
        citations: 34,
        topic: "Web",
        abstract: "Pengembangan PWA memungkinkan mahasiswa mengakses materi perkuliahan secara offline tanpa perlu mengunduh aplikasi di Play Store.",
        citation: "Pratama, D. (2023). Implementasi Progressive Web Apps (PWA) untuk Media Pembelajaran Kampus. Jurnal Edukasi Web, 7(4), 200-210."
    }
];

// ==========================================
// 2. STATE (Penyimpanan Status Sementara)
// ==========================================
// Mengambil daftar bookmark dari LocalStorage browser (jika ada)
let bookmarks = JSON.parse(localStorage.getItem('jurnalspot_bookmarks')) || [];
let isShowingBookmarksOnly = false;

// Elemen-elemen HTML yang dipanggil berdasarkan ID
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortBy = document.getElementById('sortBy');
const journalGrid = document.getElementById('journalGrid');
const noResults = document.getElementById('noResults');
const journalCountText = document.getElementById('journalCountText');
const bookmarkCount = document.getElementById('bookmarkCount');
const bookmarkTabBtn = document.getElementById('bookmarkTabBtn');

// Elemen Modal & Toast
const abstractModal = document.getElementById('abstractModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalTitle = document.getElementById('modalTitle');
const modalAuthor = document.getElementById('modalAuthor');
const modalAbstractText = document.getElementById('modalAbstractText');
const modalCitationText = document.getElementById('modalCitationText');
const copyCitationBtn = document.getElementById('copyCitationBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ==========================================
// 3. FUNGSI UTAMA (RENDER TAMPILAN)
// ==========================================
function renderJournals() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortBy.value;

    // A. Filter berdasarkan Pencarian, Kategori, & Tab Bookmark
    let filtered = journalsData.filter(j => {
        const matchQuery = j.title.toLowerCase().includes(query) || 
                           j.author.toLowerCase().includes(query) ||
                           j.abstract.toLowerCase().includes(query);

        const matchCategory = selectedCategory === 'all' || j.topic === selectedCategory;
        const matchBookmark = !isShowingBookmarksOnly || bookmarks.includes(j.id);

        return matchQuery && matchCategory && matchBookmark;
    });

    // B. Pengurutan (Sorting)
    filtered.sort((a, b) => {
        if (selectedSort === 'latest') return b.year - a.year;
        if (selectedSort === 'citations') return b.citations - a.citations;
        return 0;
    });

    // C. Tampilkan ke HTML
    journalGrid.innerHTML = '';

    if (filtered.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        filtered.forEach(journal => {
            const isBookmarked = bookmarks.includes(journal.id);
            const cardHTML = `
                <div class="journal-card">
                    <div>
                        <span class="card-tag">${journal.topic}</span>
                        <h3 class="card-title">${journal.title}</h3>
                        <p class="card-author">${journal.author} (${journal.year})</p>
                    </div>
                    <div>
                        <div class="card-meta">
                            <span><i class="fa-solid fa-quote-right"></i> ${journal.citations} Sitasi</span>
                            <span>Tahun ${journal.year}</span>
                        </div>
                        <div class="card-actions">
                            <button class="btn-primary" onclick="openModal(${journal.id})">
                                <i class="fa-regular fa-file-lines"></i> Abstrak
                            </button>
                            <button class="btn-icon ${isBookmarked ? 'active' : ''}" onclick="toggleBookmark(${journal.id})" title="Simpan ke Favorit">
                                <i class="fa-${isBookmarked ? 'solid' : 'regular'} fa-bookmark"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            journalGrid.innerHTML += cardHTML;
        });
    }

    // Update Angka
    journalCountText.textContent = `${filtered.length} Jurnal Ditemukan`;
    updateBookmarkCountUI();
}

// ==========================================
// 4. FUNGSI BOOKMARK / FAVORIT (LOCALSTORAGE)
// ==========================================
function toggleBookmark(id) {
    if (bookmarks.includes(id)) {
        bookmarks = bookmarks.filter(bId => bId !== id);
        showToast("Jurnal dihapus dari favorit");
    } else {
        bookmarks.push(id);
        showToast("Jurnal disimpan ke favorit!");
    }

    // Simpan ke LocalStorage agar tidak hilang saat di-refresh
    localStorage.setItem('jurnalspot_bookmarks', JSON.stringify(bookmarks));
    renderJournals();
}

function updateBookmarkCountUI() {
    bookmarkCount.textContent = bookmarks.length;
}

// Toggle Tampilan Tab Favorit
bookmarkTabBtn.addEventListener('click', () => {
    isShowingBookmarksOnly = !isShowingBookmarksOnly;
    if (isShowingBookmarksOnly) {
        bookmarkTabBtn.style.backgroundColor = '#dbeafe';
        showToast("Menampilkan jurnal favorit");
    } else {
        bookmarkTabBtn.style.backgroundColor = '';
    }
    renderJournals();
});

// ==========================================
// 5. FUNGSI MODAL ABSTRAK & SALIN SITASI
// ==========================================
function openModal(id) {
    const journal = journalsData.find(j => j.id === id);
    if (!journal) return;

    modalTitle.textContent = journal.title;
    modalAuthor.textContent = `${journal.author} • ${journal.year}`;
    modalAbstractText.textContent = journal.abstract;
    modalCitationText.textContent = journal.citation;

    abstractModal.classList.remove('hidden');
}

closeModalBtn.addEventListener('click', () => {
    abstractModal.classList.add('hidden');
});

// Tutup modal jika klik di luar area kartu modal
window.addEventListener('click', (e) => {
    if (e.target === abstractModal) {
        abstractModal.classList.add('hidden');
    }
});

// Salin Sitasi ke Clipboard
copyCitationBtn.addEventListener('click', () => {
    const citationText = modalCitationText.textContent;
    navigator.clipboard.writeText(citationText).then(() => {
        showToast("Format sitasi berhasil disalin!");
    });
});

// ==========================================
// 6. FUNGSI TOAST NOTIFIKASI
// ==========================================
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// ==========================================
// 7. EVENT LISTENERS (INPUT & FILTER)
// ==========================================
searchInput.addEventListener('input', renderJournals);
categoryFilter.addEventListener('change', renderJournals);
sortBy.addEventListener('change', renderJournals);

// Jalankan fungsi awal saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    renderJournals();
});

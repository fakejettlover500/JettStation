// Typewriter words for the hero heading.
const words = ["Fatima.", "Jettlover5000.", "KanyeWestFan5000."];
const typewriter = document.getElementById("typewriter");
const enterScreen = document.getElementById("enterScreen");
const siteContent = document.getElementById("siteContent");
const bgMusic = document.getElementById("bgMusic");

document.body.classList.add("no-scroll");

// Browsers usually block autoplay with sound. This enter screen solves that by
// making the user click first, which gives permission for the music to play.
enterScreen.addEventListener("click", async () => {
  enterScreen.classList.add("fade-out");
  siteContent.classList.remove("hidden-site");
  document.body.classList.remove("no-scroll");

  try {
    bgMusic.volume = 0.45;
    await bgMusic.play();
  } catch (error) {
    console.log("Music could not start:", error);
  }

  setTimeout(() => {
    enterScreen.style.display = "none";
  }, 1000);
});

let wordIndex = 0;
let letterIndex = 0;
let isDeleting = false;

const typingSpeed = 95;
const deletingSpeed = 55;
const pauseAfterTyping = 1300;
const pauseAfterDeleting = 350;

function typeLoop() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    letterIndex--;
  } else {
    letterIndex++;
  }

  typewriter.textContent = currentWord.slice(0, letterIndex);

  // Pause briefly after the full word is typed.
  if (!isDeleting && letterIndex === currentWord.length) {
    isDeleting = true;
    setTimeout(typeLoop, pauseAfterTyping);
    return;
  }

  // Move to the next word once the current word has been deleted.
  if (isDeleting && letterIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeLoop, pauseAfterDeleting);
    return;
  }

  const speed = isDeleting ? deletingSpeed : typingSpeed;
  setTimeout(typeLoop, speed);
}

typeLoop();

// Subtle scroll reveal animation for section text and gallery cards.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -50px 0px"
  }
);

function observeReveal(element) {
  revealObserver.observe(element);
}

document.querySelectorAll(".reveal").forEach((element) => {
  observeReveal(element);
});

// Looping button-controlled gallery.
const galleryImages = [
  "images/gallery1.jpg",
  "images/gallery2.jpg",
  "images/gallery3.jpg",
  "images/gallery4.jpg",
  "images/gallery5.jpg",
  "images/gallery6.jpg"
];

const galleryGrid = document.getElementById("galleryGrid");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");

let currentIndex = 0;

function getImagesPerView() {
  return window.innerWidth <= 768 ? 1 : 3;
}

function renderGallery() {
  const imagesPerView = getImagesPerView();
  galleryGrid.innerHTML = "";

  for (let i = 0; i < imagesPerView; i++) {
    const imageIndex = (currentIndex + i) % galleryImages.length;
    const imagePath = galleryImages[imageIndex];

    const card = document.createElement("div");
    card.className = "gallery-card reveal";

    const img = document.createElement("img");
    img.src = imagePath;
    img.alt = `Gallery image ${imageIndex + 1}`;

    img.onerror = () => {
      card.classList.add("image-missing");
      card.innerHTML = `<span>Image ${imageIndex + 1}</span>`;
    };

    card.appendChild(img);
    galleryGrid.appendChild(card);
    observeReveal(card);
  }
}

galleryNext.addEventListener("click", () => {
  const step = getImagesPerView();
  currentIndex = (currentIndex + step) % galleryImages.length;
  renderGallery();
});

galleryPrev.addEventListener("click", () => {
  const step = getImagesPerView();
  currentIndex = (currentIndex - step + galleryImages.length) % galleryImages.length;
  renderGallery();
});

window.addEventListener("resize", renderGallery);

renderGallery();

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();

const serviceFilters = document.querySelectorAll(".service-filter");
const serviceCards = document.querySelectorAll(".service-card");

serviceFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.filter;

    serviceFilters.forEach((button) => {
      const isActive = button === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    serviceCards.forEach((card) => {
      card.hidden = category !== "all" && card.dataset.category !== category;
    });
  });
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".service-image-track");
  if (!track) return;

  const slides = Array.from(track.children);
  const counter = carousel.querySelector(".image-count");
  const formatNumber = (value) => String(value).padStart(2, "0");

  const loadSlide = (index) => {
    const image = slides[index]?.querySelector("img");
    if (image?.dataset.src) {
      image.src = image.dataset.src;
      delete image.dataset.src;
    }
  };

  const currentIndex = () => Math.min(
    slides.length - 1,
    Math.max(0, Math.round(track.scrollLeft / track.clientWidth))
  );

  const updateCarousel = () => {
    const index = currentIndex();
    loadSlide(index);
    if (counter && slides.length > 1) {
      counter.textContent = `${formatNumber(index + 1)} / ${formatNumber(slides.length)}`;
    }
  };

  carousel.querySelectorAll(".image-nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.direction);
      const nextIndex = (currentIndex() + direction + slides.length) % slides.length;
      loadSlide(nextIndex);
      track.scrollTo({ left: nextIndex * track.clientWidth, behavior: "smooth" });
      updateCarousel();
    });
  });

  track.addEventListener("scroll", () => window.requestAnimationFrame(updateCarousel));
  track.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex() + direction + slides.length) % slides.length;
    loadSlide(nextIndex);
    track.scrollTo({ left: nextIndex * track.clientWidth, behavior: "smooth" });
  });

  if (slides.length < 2) {
    carousel.querySelector(".service-image-controls")?.classList.add("single-image");
  }
});


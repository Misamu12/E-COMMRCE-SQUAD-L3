// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("aos-animate")
    }
  })
}, observerOptions)

// Add animation classes on load
document.addEventListener("DOMContentLoaded", () => {
  // Observe all elements with data-aos attribute
  const elements = document.querySelectorAll("[data-aos]")
  elements.forEach((el) => {
    observer.observe(el)
  })
})

// Add CSS for animations
const style = document.createElement("style")
style.textContent = `
    [data-aos] {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    [data-aos].aos-animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    [data-aos="fade-up"] {
        transform: translateY(30px);
    }
    
    [data-aos="fade-right"] {
        transform: translateX(-30px);
    }
    
    [data-aos="fade-left"] {
        transform: translateX(30px);
    }
    
    [data-aos][data-aos-delay="100"] {
        transition-delay: 0.1s;
    }
    
    [data-aos][data-aos-delay="200"] {
        transition-delay: 0.2s;
    }
    
    [data-aos][data-aos-delay="300"] {
        transition-delay: 0.3s;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

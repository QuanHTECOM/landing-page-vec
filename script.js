// ======================= HEADER ======================= \\
document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuSidebar = document.getElementById('mobileMenuSidebar');
    const menuOverlay = document.getElementById('mobileMenuOverlay');
    const menuClose = document.getElementById('mobileMenuClose');
    const body = document.body;

    // Open menu
    menuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        openMenu();
    });

    // Close menu - button
    menuClose.addEventListener('click', function () {
        closeMenu();
    });

    // Close menu - overlay
    menuOverlay.addEventListener('click', function () {
        closeMenu();
    });

    // Close menu khi click link
    const menuLinks = menuSidebar.querySelectorAll('.mobile-menu-item');
    menuLinks.forEach(link => {
        link.addEventListener('click', function () {
            closeMenu();
        });
    });

    // Open menu function
    function openMenu() {
        menuSidebar.classList.add('show');
        menuOverlay.classList.add('show');
        body.classList.add('menu-open');

        // Change button icon
        const icon = menuBtn.querySelector('i');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        // menuBtn.classList.add('active');
    }

    // Close menu function
    function closeMenu() {
        menuSidebar.classList.remove('show');
        menuOverlay.classList.remove('show');
        body.classList.remove('menu-open');

        // Change button icon back
        const icon = menuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        menuBtn.classList.remove('active');
    }

    // Close khi resize về desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 1024) {
            closeMenu();
        }
    });

    // ESC key to close
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menuSidebar.classList.contains('show')) {
            closeMenu();
        }
    });

    // Smooth scroll cho anchor links
    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();

                const target = document.querySelector(href);
                if (target) {
                    const header = document.querySelector('.header-main');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    closeMenu();

                    setTimeout(() => {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            }
        });
    });

    // Active state dựa vào URL
    const currentPath = window.location.pathname;
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            // link.classList.add('active');
        }
    });
});
// ======================= END HEADER ======================= \\


// ======================= HOME BANNER ======================= \\
document.addEventListener('DOMContentLoaded', function () {
    const allSlides = document.querySelectorAll('.hero-slide-content');

    // Setup ban đầu
    allSlides.forEach((slide, index) => {
        slide.style.position = 'absolute';
        slide.style.width = '100%';
        slide.style.top = '0';
        slide.style.left = '0';
        slide.style.transition = 'transform 0.6s ease-in-out, opacity 0.6s ease-in-out';

        if (index === 0) {
            slide.style.display = 'flex';
            slide.style.transform = 'translateX(0)';
            slide.style.opacity = '1';
        } else {
            slide.style.display = 'none';
            slide.style.transform = 'translateX(100%)';
            slide.style.opacity = '0';
        }
    });

    // Thêm wrapper position relative
    const heroContainer = document.querySelector('.hero-left-content');
    if (heroContainer) {
        heroContainer.style.position = 'relative';
    }

    // Thêm class active cho feature item đầu tiên
    document.querySelector('.feature-item.slide-1').classList.add('active');

    let currentSlide = 1;
    let autoSlideInterval;
    const totalSlides = 4;
    let isAnimating = false;

    // ✅ Hàm chuyển slide với direction
    function changeSlide(slideNumber, direction = 'next') {
        if (isAnimating) return;
        if (slideNumber === currentSlide) return;

        isAnimating = true;

        const currentSlideElement = document.querySelector('.content-slide-' + currentSlide);
        const nextSlideElement = document.querySelector('.content-slide-' + slideNumber);

        // ✅ Set vị trí ban đầu cho slide tiếp theo
        if (direction === 'next') {
            // Slide mới đến từ bên phải
            nextSlideElement.style.transform = 'translateX(100%)';
        } else {
            // Slide mới đến từ bên trái
            nextSlideElement.style.transform = 'translateX(-100%)';
        }

        nextSlideElement.style.display = 'flex';
        nextSlideElement.style.opacity = '1';

        // Force reflow
        nextSlideElement.offsetHeight;

        // ✅ Animate
        requestAnimationFrame(() => {
            // Slide hiện tại đi ra
            if (direction === 'next') {
                currentSlideElement.style.transform = 'translateX(-100%)';
            } else {
                currentSlideElement.style.transform = 'translateX(100%)';
            }
            currentSlideElement.style.opacity = '0';

            // Slide mới vào giữa
            nextSlideElement.style.transform = 'translateX(0)';
        });

        // ✅ Cleanup sau khi animation xong
        setTimeout(() => {
            currentSlideElement.style.display = 'none';
            isAnimating = false;
        }, 600);

        // Update active state
        document.querySelectorAll('.feature-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector('.feature-item.slide-' + slideNumber).classList.add('active');

        currentSlide = slideNumber;
    }

    // ✅ Next slide function
    function nextSlide() {
        let next = currentSlide + 1;
        if (next > totalSlides) {
            next = 1;
        }
        changeSlide(next, 'next');
    }

    // ✅ Previous slide function
    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 1) {
            prev = totalSlides;
        }
        changeSlide(prev, 'prev');
    }

    // Click event cho arrows
    document.querySelector('.slider-prev').addEventListener('click', function () {
        prevSlide();
        resetAutoSlide();
    });

    document.querySelector('.slider-next').addEventListener('click', function () {
        nextSlide();
        resetAutoSlide();
    });

    // ✅ Click event cho feature items với direction logic
    document.querySelectorAll('.feature-item').forEach((item, index) => {
        item.addEventListener('click', function () {
            const targetSlide = index + 1;
            const direction = targetSlide > currentSlide ? 'next' : 'prev';
            changeSlide(targetSlide, direction);
            resetAutoSlide();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoSlide();
        }
    });

    // Auto slide function
    function startAutoSlide() {
        autoSlideInterval = setInterval(function () {
            nextSlide();
        }, 1000000); // 5 giây
    }

    // Reset auto slide khi user tương tác
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Bắt đầu auto slide
    startAutoSlide();

    // ✅ RESPONSIVE: Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const sliderContainer = document.querySelector('.hero-slider');

    sliderContainer.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - prev slide
                prevSlide();
            }
            resetAutoSlide();
        }
    }

    // ✅ RESPONSIVE: Pause autoplay when tab is not visible
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            clearInterval(autoSlideInterval);
        } else {
            startAutoSlide();
        }
    });

    // ✅ RESPONSIVE: Adjust slide height on resize
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            // Recalculate positions if needed
            const currentSlideElement = document.querySelector('.content-slide-' + currentSlide);
            if (currentSlideElement) {
                currentSlideElement.style.transform = 'translateX(0)';
            }
        }, 250);
    });

    // ✅ RESPONSIVE: Prevent default touch behavior on arrows
    const arrows = document.querySelectorAll('.slider-arrow');
    arrows.forEach(arrow => {
        arrow.addEventListener('touchstart', function (e) {
            e.stopPropagation();
        }, { passive: true });
    });

    // ✅ MOBILE: Disable autoplay on mobile in landscape mode
    function checkOrientation() {
        const isMobile = window.innerWidth <= 767;
        const isLandscape = window.innerHeight < window.innerWidth;

        if (isMobile && isLandscape) {
            clearInterval(autoSlideInterval);
        } else if (!document.hidden) {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
    }

    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);
});
// ======================= END HOME BANNER ======================= \\


// ======================= FOOTER ======================= \\

const btnScrollTop = document.getElementById("btn-scroll-toll");
const btnMenu = document.getElementById("btn-menu");
const subMenu = document.getElementById("list-item");
const liveModal = document.getElementById("liveModal");
const liveBackdrop = document.getElementById("liveBackdrop");
const closeLiveModal = document.getElementById("closeLiveModal");
const iframeLive = document.getElementById("iframeLive");
const isMobile = window.innerWidth <= 1023;

let iconLive;
let isShowMenu = false;

btnScrollTop.addEventListener("click", () => {
    window.scrollTo({ top: 0 });
});

btnMenu.addEventListener("click", () => {
    if (isShowMenu) {
        subMenu.innerHTML = "";
        btnMenu.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7H21" stroke="white" stroke-width="1.5" stroke-linecap="round" />
          <path d="M3 12H21" stroke="white" stroke-width="1.5" stroke-linecap="round" />
          <path d="M3 17H21" stroke="white" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      `;
    } else {
        subMenu.innerHTML = listSubMenu
            .map((item, index) => {
                const totalItems = listSubMenu.length; // Total number of items
                const angle = (index / (totalItems - 1)) * 120 + 270; // Angle from 8 o'clock (240 degrees) to 12 o'clock (360 degrees)

                // Responsive radius và offset dựa trên kích thước màn hình
                const buttonSize = isMobile ? 44 : 58; // Kích thước button theo breakpoint
                const radius = isMobile ? 70 : 90; // Radius nhỏ hơn trên mobile
                const xOffset = -35; // Offset X điều chỉnh cho mobile
                const yOffset = isMobile ? -9 : -12; // Offset Y điều chỉnh cho mobile

                // Calculate x and y position based on the circular path
                const xPosition = radius * Math.cos((angle * Math.PI) / 180) + xOffset; // X position based on angle
                const yPosition = radius * Math.sin((angle * Math.PI) / 180) + yOffset; // Y position based on angle

                // Adjust the right and bottom properties to center the sub-menu and position items
                const positionStyle = `right: ${50 + xPosition}%; bottom: ${50 - yPosition}%`;

                return `
  <div class="absolute group z-10 hover:z-[999]" style="${positionStyle}">
    ${item.url
                        ? `<a href="${item.url}" class="sub-menu__item block">
            <img src="${item.img}" alt="">
          </a>`
                        : `<img
            id="iconLive"
            class="sub-menu__item cursor-pointer"
            src="${item.img}"
            alt=""
          >`
                    }

    <!-- LABEL -->
    <div
      class="
        pointer-events-none
        absolute
        right-full
        mr-2
        top-1/2
        -translate-y-1/2
        bg-white
        text-black
        text-[16px]
        px-2
        py-1
        rounded
        shadow-md
        whitespace-nowrap
        opacity-0
        group-hover:opacity-100
        transition
        duration-150
      "
    >
      ${item.title}
    </div>
  </div>
`;

            })
            .join("");
        btnMenu.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 7L7 17M7 7L17 17" stroke="white" stroke-width="2" stroke-linecap="round" />
      </svg>
      `;
        iconLive = document.getElementById("iconLive");
        if (iconLive) {
            iconLive.addEventListener("click", () => {
                openLive();
            });
        }
    }
    isShowMenu = !isShowMenu;
});

const listSubMenu = [
    { img: "https://res.cloudinary.com/wfnguyen/image/upload/v1767882406/Live_zx5bqe.png", title: "LIVESTREAM" },
    { img: "https://res.cloudinary.com/wfnguyen/image/upload/v1767882407/Tra_c%E1%BB%A9u_tuy%E1%BA%BFn_%C4%91%C6%B0%E1%BB%9Dng_htdn1u.png", url: "/web/guest/san-pham-dich-vu", title: "DỊCH VỤ VEC" },
    { img: "https://res.cloudinary.com/wfnguyen/image/upload/v1767882407/Tra_c%E1%BB%A9u_tuy%E1%BA%BFn_%C4%91%C6%B0%E1%BB%9Dng-1_j4xf9v.png", url: "/web/guest/trangchu/thongtintructuyen/thongtintuyenduong", title: "TRA CỨU TUYẾN ĐƯỜNG" },
    { img: "https://res.cloudinary.com/wfnguyen/image/upload/v1767882406/Tra_c%E1%BB%A9u_c%C6%B0%E1%BB%9Bc_ph%C3%AD_zfuaxi.png", url: "/web/guest/trangchu/thongtintructuyen/cuocphituyenduong", title: "TRA CỨU CƯỚC PHÍ" },
];

// Open modal
function openLive() {
    liveModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    iframeLive.src = "https://www.youtube.com/embed/3OOEf-gtFZg";
}

// Close modal
function closeModal() {
    liveModal.classList.add("hidden");
    document.body.style.overflow = "";
    iframeLive.src = "";
}

closeLiveModal.addEventListener("click", () => {
    closeModal();
});

window.addEventListener("scroll", function () {
    var scrollTop = window.scrollY;
    if (scrollTop >= 10) {
        btnScrollTop.classList.remove("hidden-btn-scroll-toll");
        btnMenu.classList.remove(`bottom-[${isMobile ? 60 : 72}px]`);
        btnMenu.classList.add(`bottom-[${isMobile ? 110 : 138}px]`);
    } else {
        btnScrollTop.classList.add("hidden-btn-scroll-toll");
        btnMenu.classList.remove(`bottom-[${isMobile ? 110 : 138}px]`);
        btnMenu.classList.add(`bottom-[${isMobile ? 60 : 72}px]`);
    }
});

(() => {
    const tinyTalkShadowHost = document.querySelector("#tiny-talk-shadow-host");
    if (!tinyTalkShadowHost || !tinyTalkShadowHost.shadowRoot) {
        return;
    }
    const shadowRoot = tinyTalkShadowHost.shadowRoot;
    const style = document.createElement("style");
    style.textContent = `
        .tiny-talk-launcher {
            width: 58px !important;
            height: 58px !important;
					  transform: translateX(3px);
        }
				 .tiny-talk-launcher:hover {
      z-index: 999 !important;
    }

    /* TOOLTIP */
    .tiny-talk-launcher::after {
      content: "Chatbot";
      position: absolute;
      right: 100%;
      margin-right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: #ffffff;
      color: #000000;
      font-size: 16px;
      padding: 4px 8px;
      border-radius: 6px;
      white-space: nowrap;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s ease;
    }

    /* Hover thì hiện tooltip */
    .tiny-talk-launcher:hover::after {
      opacity: 1;
    }
    `;
    shadowRoot.appendChild(style);
})();

// ======================= END FOOTER ======================= \\

// ======================= ĐƠN VỊ THÀNH VIÊN ======================= \\
$(document).ready(function () {
    const slider = $('#tabcontentSlider');

    if (slider.hasClass('slick-initialized')) {
        slider.slick('unslick');
    }

    slider.on('init', function (event, slick) {
        console.log('Init event fired');

        // ✅ Tìm .single-tab đầu tiên (không phải clone)
        const firstTab = $(this).find('.single-tab:not(.slick-cloned)').first();
        console.log('First tab found:', firstTab.length);

        firstTab.addClass('active-tab');
        console.log('Active added:', firstTab.hasClass('active-tab'));
    });

    slider.slick({
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 4000,
        arrows: false,
        pauseOnFocus: false,
        cssEase: 'linear',
        responsive: [
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 481,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 0, // Mobile
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    })

    slider.on('click', '.single-tab', function () {
        slider.find('.single-tab').removeClass('active-tab');
        $(this).addClass('active-tab');
        console.log('Tab clicked and activated');
    });

    // Custom arrows
    $('#tabcontentPrev').click(function () {
        $('#tabcontentSlider').slick('slickPrev');
    });

    $('#tabcontentNext').click(function () {
        $('#tabcontentSlider').slick('slickNext');
    });
});
// ======================= END ĐƠN VỊ THÀNH VIÊN ======================= \\

// ======================= LĨNH VỰC KINH DOANH ======================= \\
$(document).ready(function () {
    // const sliderBusiness = $('#carditemsSlider');

    // sliderBusiness.slick({
    //     dots: false,
    //     infinite: true,
    //     speed: 500,
    //     slidesToShow: 3,
    //     slidesToScroll: 1,
    //     autoplay: false,
    //     autoplaySpeed: 4000,
    //     arrows: false,
    //     pauseOnHover: true,
    //     pauseOnFocus: false,
    //     cssEase: 'linear',
    //     responsive: [
    //         {
    //             breakpoint: 1280,
    //             settings: {
    //                 slidesToShow: 4,
    //                 slidesToScroll: 1
    //             }
    //         },
    //         {
    //             breakpoint: 1024,
    //             settings: {
    //                 slidesToShow: 4,
    //                 slidesToScroll: 1
    //             }
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 3,
    //                 slidesToScroll: 1
    //             }
    //         },
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 1
    //             }
    //         }
    //     ]
    // })

    // // Custom arrows
    // $('#carditemsPrev').click(function () {
    //     $('#carditemsSlider').slick('slickPrev');
    // });

    // $('#carditemsNext').click(function () {
    //     $('#carditemsSlider').slick('slickNext');
    // });
});
// ======================= END LĨNH VỰC KINH DOANH ======================= \\

// ======================= ĐỐI TÁC ======================= \\
$(document).ready(function () {
    // Khởi tạo Slick Slider
    $('#partnerSlider').slick({
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 8,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
        pauseOnHover: true,
        pauseOnFocus: false,
        cssEase: 'linear',
        responsive: [
            {
                breakpoint: 1281,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 481,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    });

    // Custom arrows
    $('#partnerPrev').click(function () {
        $('#partnerSlider').slick('slickPrev');
    });

    $('#partnerNext').click(function () {
        $('#partnerSlider').slick('slickNext');
    });

    console.log('Partner slider initialized successfully!');
});
// ======================= END ĐỐI TÁC ======================= \\

// ======================= INTRO COMPANY ======================= \\
// $(document).ready(function () {
//   $('.content-images').slick({
//     dots: true,
//     infinite: true,
//     speed: 500,
//     fade: true,
//     cssEase: 'linear',
//     autoplay: true,
//     autoplaySpeed: 2000,
//     arrows: false,
//   });
// })
// ======================= END INTRO COMPANY ======================= \\


// Click chuyển tab thay đổi nội dung trang \\
// Data cho mỗi tab
const tabData = {
    0: {
        intro: {
            subtitle: "Giới thiệu",
            title: "Công ty Cổ phần Tư vấn đường cao tốc Việt Nam",
            description: "Công ty cổ phần Tư vấn đường cao tốc Việt Nam (VEC Consultant) - Top 10 công ty tư vấn ngành GTVT - là đơn vị thành viên của Tổng Công ty Đầu tư Phát triển Đường cao tốc Việt Nam (VEC), hoạt động chuyên nghiệp trong lĩnh vực tư vấn xây dựng công trình giao thông nói chung và công trình đường cao tốc nói riêng tại Việt Nam.",
            images: [
                "./assets/img/intro-img-1.png",
                "./assets/img/intro-img-2.png",
                "./assets/img/intro-img-1.png"
            ],
            link: "https://vecc.com.vn/"
        },
        business: {
            subtitle: "LĨNH VỰC KINH DOANH",
            title: "Chúng tôi cung cấp các lĩnh vực",
            cards: [
                {
                    image: "./assets/img/card-img-1.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Quản lý khai thác đường cao tốc",
                    link: "#"
                },
                {
                    image: "./assets/img/card-img-2.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Xây dựng công trình",
                    link: "#"
                },
                {
                    image: "./assets/img/card-img-3.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Dự án đầu tư",
                    link: "#"
                },
                {
                    image: "./assets/img/card-img-2.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Dự án đầu tư",
                    link: "#"
                },
            ]
        }
    },
    1: {
        intro: {
            subtitle: "Giới thiệu",
            title: "Công ty Cổ phần Dịch vụ đường cao tốc Việt Nam",
            description: "Công ty Cổ phần Dịch vụ đường cao tốc Việt Nam chuyên cung cấp các dịch vụ chất lượng cao trên hệ thống đường cao tốc, bao gồm trạm dừng nghỉ, bảo dưỡng xe, và các tiện ích phục vụ người dân.",
            images: [
                "./assets/img/intro-img-2.png",
                "./assets/img/intro-img-1.png",
                "./assets/img/intro-img-2.png"
            ],
            link: "https://vecs.com.vn/vi/"
        },
        business: {
            subtitle: "DỊCH VỤ CHUYÊN NGHIỆP",
            title: "Các dịch vụ chúng tôi cung cấp",
            cards: [
                {
                    image: "./assets/img/card-img-2.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Dịch vụ trạm dừng nghỉ",
                    link: "#"
                },
                {
                    image: "./assets/img/card-img-3.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Dịch vụ bảo dưỡng xe",
                    link: "#"
                },
                {
                    image: "./assets/img/card-img-1.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Dịch vụ cứu hộ",
                    link: "#"
                }
            ]
        }
    },
    2: {
        intro: {
            subtitle: "Giới thiệu",
            title: "Công ty CP Vận hành & Bảo trì đường cao tốc Việt Nam",
            description: "Công ty chuyên về vận hành và bảo trì hệ thống đường cao tốc, đảm bảo an toàn giao thông và chất lượng đường bộ cho người dân.",
            images: [
                "./assets/img/intro-img-1.png",
                "./assets/img/intro-img-2.png",
                "./assets/img/intro-img-1.png"
            ],
            link: "#"
        },
        business: {
            subtitle: "LĨNH VỰC HOẠT ĐỘNG",
            title: "Chuyên môn của chúng tôi",
            cards: [
                {
                    image: "./assets/img/card-img-3.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Vận hành hệ thống đường",
                    link: "#"
                },
                {
                    image: "./assets/img/card-img-1.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Bảo trì công trình",
                    link: "#"
                },
                {
                    image: "./assets/img/card-img-2.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Giám sát an toàn",
                    link: "#"
                }
            ]
        }
    },
    3: {
        intro: {
            subtitle: "Giới thiệu",
            title: "Công ty Cổ phần Dịch vụ KỸ THUẬT đường cao tốc Việt Nam",
            description: "Công ty cung cấp các dịch vụ kỹ thuật chuyên sâu, tư vấn thiết kế, giám sát thi công và đánh giá chất lượng công trình đường cao tốc.",
            images: [
                "./assets/img/intro-img-2.png",
                "./assets/img/intro-img-1.png",
                "./assets/img/intro-img-2.png"
            ],
            link: "#"
        },
        business: {
            subtitle: "DỊCH VỤ KỸ THUẬT",
            title: "Giải pháp kỹ thuật toàn diện",
            cards: [
                {
                    image: "./assets/img/card-img-1.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Tư vấn thiết kế",
                    link: "#"
                },
                {
                    image: "./assets/img/card-img-2.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Giám sát thi công",
                    link: "#"
                },
                {
                    image: "./assets/img/card-img-3.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Đánh giá chất lượng",
                    link: "#"
                }
            ]
        }
    },
    4: {
        intro: {
            subtitle: "Giới thiệu",
            title: "Trung tâm Nghiên cứu phát triển đường cao tốc Việt Nam",
            description: "Công ty cung cấp các dịch vụ kỹ thuật chuyên sâu, tư vấn thiết kế, giám sát thi công và đánh giá chất lượng công trình đường cao tốc.",
            images: [
                "./assets/img/intro-img-2.png",
                "./assets/img/intro-img-1.png",
                "./assets/img/intro-img-2.png"
            ],
            link: "#"
        },
        business: {
            subtitle: "DỊCH VỤ KỸ THUẬT",
            title: "Giải pháp kỹ thuật toàn diện",
            cards: [
                {
                    image: "./assets/img/card-img-1.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Tư vấn thiết kế",
                    link: "#"
                },
                {
                    image: "./assets/img/card-img-2.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Giám sát thi công",
                    link: "#"
                },
                {
                    image: "./assets/img/card-img-3.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Đánh giá chất lượng",
                    link: "#"
                }
            ]
        }
    },
    5: {
        intro: {
            subtitle: "Giới thiệu",
            title: "Trung tâm Nghiên cứu phát triển đường cao tốc Việt Nam",
            description: "Công ty cung cấp các dịch vụ kỹ thuật chuyên sâu, tư vấn thiết kế, giám sát thi công và đánh giá chất lượng công trình đường cao tốc.",
            images: [
                "./assets/img/intro-img-2.png",
                "./assets/img/intro-img-1.png",
                "./assets/img/intro-img-2.png"
            ],
            link: "#"
        },
        business: {
            subtitle: "DỊCH VỤ KỸ THUẬT",
            title: "Giải pháp kỹ thuật toàn diện",
            cards: [
                {
                    image: "./assets/img/card-img-1.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Tư vấn thiết kế",
                    link: "#"
                },
                {
                    image: "./assets/img/card-img-2.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Giám sát thi công",
                    link: "#"
                },
                {
                    image: "./assets/img/card-img-3.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Đánh giá chất lượng",
                    link: "#"
                },
                {
                    image: "./assets/img/card-img-2.png",
                    icon: "./assets/img/icon-lvkd.png",
                    name: "Đánh giá chất lượng",
                    link: "#"
                },
            ]
        }
    }
};

// Function cập nhật nội dung Giới thiệu công ty
function updateIntroContent(data) {
    // Update subtitle
    document.querySelector('.intro-subtitle').textContent = data.subtitle;

    // Update title
    document.querySelector('.intro-heading-title').textContent = data.title;

    // Update description
    document.querySelector('.intro-description').textContent = data.description;

    const buttonLink = document.querySelector('.intro-view-more').closest('a');
    if (buttonLink) {
        buttonLink.href = data.link || '#';

        // Optional: Update text của button
        // if (data.link) {
        //     document.querySelector('.intro-view-more span').textContent = data.link;
        // }
    }

    // Update images với Slick Slider
    const slickSlider = $('.content-images');

    // Destroy slick nếu đã init
    if (slickSlider.hasClass('slick-initialized')) {
        slickSlider.slick('unslick');
    }

    // Clear và thêm ảnh mới
    slickSlider.empty();
    data.images.forEach(imgSrc => {
        slickSlider.append(`
            <div>
                <img src="${imgSrc}" alt="" class="w-full h-80 object-cover img-intro">
            </div>
        `);
    });

    $(document).ready(function () {
        // Re-init slick slider
        slickSlider.slick({
            dots: true,
            infinite: true,
            speed: 500,
            fade: true,
            cssEase: 'linear',
            autoplay: true,
            autoplaySpeed: 3000,
            arrows: false,
        });
    });

}

// Function cập nhật nội dung Lĩnh vực kinh doanh
function updateBusinessContent(data) {
    const cardsWrapper = $('#carditemsSlider');
    const prevArrow = $('#carditemsPrev');
    const nextArrow = $('#carditemsNext');

    // Destroy slick nếu đã init
    if (cardsWrapper.hasClass('slick-initialized')) {
        cardsWrapper.slick('unslick');
    }

    // Xóa nội dung cũ
    cardsWrapper.empty();

    // Update text
    document.querySelector('.business-fields-subtitle p').textContent = data.subtitle;
    document.querySelector('.business-fields-title h1').textContent = data.title;

    // Kiểm tra số lượng items
    const itemCount = data.cards.length;
    const additionalClass = itemCount >= 4 ? 'card-item-4' : 'card-item-3';

    // Add cards (không dùng slider)
    data.cards.forEach(card => {
        cardsWrapper.append(`
            <div class="card-item ${additionalClass}">
                <div class="card-item-img">
                    <img src="${card.image}" alt="">
                </div>
                <div class="card-item-icon-name">
                    <div class="icon-content">
                        <img src="${card.icon}" alt="">
                    </div>
                    <div class="name-content">
                        <a href="${card.link}">${card.name}</a>
                    </div>
                </div>
                <div class="bg-card-item">
                    <img src="./assets/img/bg-card-lvkd.png" alt="">
                </div>
            </div>
        `);
    });

    // Ẩn arrows vì không dùng slider
    prevArrow.hide();
    nextArrow.hide();
}

// Event listener cho tabs
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.single-tab');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function () {
            // Remove active class từ tất cả tabs
            tabs.forEach(t => t.classList.remove('active-tab'));

            // Add active class cho tab được click
            this.classList.add('active-tab');

            // Lấy data tương ứng
            const data = tabData[index];

            // Cập nhật content với fade effect
            const introSection = document.querySelector('.container-intro-company');
            const businessSection = document.querySelector('.container-business-fields');

            // Fade out
            introSection.style.opacity = '0';
            businessSection.style.opacity = '0';

            setTimeout(() => {
                // Update content
                updateIntroContent(data.intro);
                updateBusinessContent(data.business);

                // Fade in
                introSection.style.opacity = '1';
                businessSection.style.opacity = '1';

                // SetPosition cho images slider
                setTimeout(() => {
                    const imagesSlider = $('.content-images');
                    if (imagesSlider.hasClass('slick-initialized')) {
                        imagesSlider.slick('setPosition');
                    }
                }, 150);
            }, 300);
        });
    });

    // Init slick slider cho intro images
    $('.content-images').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
    });

    // Khởi tạo content cho tab đầu tiên (không dùng slider)
    if (tabData[0] && tabData[0].business) {
        updateBusinessContent(tabData[0].business);
    }
});
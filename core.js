let snapCompleted = false;

document.addEventListener("DOMContentLoaded", function () {
	if ("scrollRestoration" in history) {
		history.scrollRestoration = "manual";
	}
	window.scrollTo(0, 0);

	const sectionWrap = document.querySelector(".section-wrap");
	// sectionWrap.style.transform = "translateY(100vh)";
	sectionWrap.style.transform = "translateY(80vh)";

	// Set up main text with a fade transition
	const mainText = document.querySelector(".main-text");
	mainText.style.transition = "opacity 0.2s ease-out";
	mainText.style.opacity = "1";

	const paragraph = document.querySelector(".main-text p");
	// const randomRotation = Math.random() * 180 - 90;
	// paragraph.style.transform = `rotate(${randomRotation}deg)`;

	// Instead of unconditionally randomizing:
	if (window.innerWidth <= 500) {
		const randomRotation = Math.random() * 180 - 90;
		paragraph.style.transform = `rotate(${randomRotation}deg)`;
	}

	function setupMobileLinks() {
		console.log("Setting up mobile links"); // Confirm this message appears in the console
		const mobileLinks = document.querySelectorAll("a.mob-link");

		if (mobileLinks.length === 0) {
			console.log("No mobile links found"); // Check if the query selector found any elements
			return;
		}
	}

	setupMobileLinks();

	function setupMobileProjectTitlesToggle() {
		const mobileProjectTitles = document.querySelectorAll(
			"p.project-title-mob"
		);

		mobileProjectTitles.forEach((title, index) => {
			let touchStartY = 0;
			let touchEndY = 0;
			const threshold = 10; // Threshold to distinguish between tap and scroll

			title.addEventListener("touchstart", function (event) {
				touchStartY = event.touches[0].clientY;
			});

			title.addEventListener("touchend", function (event) {
				touchEndY = event.changedTouches[0].clientY;

				// Check if the movement is within the threshold to be considered a tap
				if (Math.abs(touchStartY - touchEndY) < threshold) {
					// Proceed with toggling the project content
					const projectWrapper = title.closest(".project-wrapper");
					const projectContent =
						projectWrapper.querySelector(".project-content");

					if (projectContent) {
						// Check the current display state and toggle it
						const isDisplayed = projectContent.style.display === "flex";
						projectContent.style.display = isDisplayed ? "none" : "flex";
						projectContent.style.maxWidth = isDisplayed ? "0" : "max-content";
					}
				}
			});
		});
	}

	setupMobileProjectTitlesToggle();

	if (window.innerWidth > 500) {
		document.addEventListener("mousemove", function (event) {
			const rect = paragraph.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;
			const radian = Math.atan2(
				event.clientY - centerY,
				event.clientX - centerX
			);
			const rotation = radian * (180 / Math.PI) + 180;
			paragraph.style.transform = "rotate(" + rotation + "deg)";
		});
	}

	if (window.innerWidth <= 500) {
		document.body.style.touchAction = "none";
		let startY;
		const touchStartHandler = function (event) {
			if (!snapCompleted) {
				startY = event.touches[0].clientY;
			}
		};

		window.addEventListener("touchstart", touchStartHandler);

		const touchMoveHandler = function (event) {
			if (!snapCompleted) {
				const currentY = event.touches[0].clientY;
				if (currentY < startY) {
					sectionWrap.style.transform = "translateY(-11px)";
					snapCompleted = true;
					mainText.style.opacity = "0"; // Fade out main text on swipe
					allowScrolling(); // Enable scrolling after snap
					document.body.style.touchAction = "auto";
					window.removeEventListener("touchstart", touchStartHandler);
					window.removeEventListener("touchmove", touchMoveHandler);
				}
			}
		};

		window.addEventListener("touchmove", touchMoveHandler);
	} else {
		activateScrollListener();
	}

	function activateScrollListener() {
		window.addEventListener("wheel", function (event) {
			// When the user scrolls down and the snap has not yet completed
			const isScrollingDown = event.deltaY > 0;
			if (isScrollingDown && !snapCompleted) {
				sectionWrap.style.transform = "translateY(0)";
				snapCompleted = true; // The snap has now completed
				mainText.style.opacity = "0"; // Fade out main text on scroll

				// As soon as snap completes, enable scrolling within sectionWrap
				allowScrolling();

				// If you only want the snap to occur once, remove the event listener
				// window.removeEventListener('wheel', activateScrollListener);
			}
		});
	}

	function allowScrolling() {
		const sectionWrap = document.querySelector(".section-wrap");
		sectionWrap.style.overflowY = "auto"; // Enable vertical scrolling
	}

	// Initialize the scroll listener when the page has loaded
	activateScrollListener();
});

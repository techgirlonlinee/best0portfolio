let snapCompleted = false;

document.addEventListener("DOMContentLoaded", function () {
	// Prevent browser scroll restoration and reset scroll position
	if ("scrollRestoration" in history) {
		history.scrollRestoration = "manual";
	}
	window.scrollTo(0, 0);

	const sectionWrap = document.querySelector(".section-wrap");
	sectionWrap.style.transform = "translateY(80vh)";

	// Set up main text fade transition
	const mainText = document.querySelector(".main-text");
	mainText.style.transition = "opacity 0.2s ease-out";
	mainText.style.opacity = "1";

	const paragraph = document.querySelector(".main-text p");

	// Apply random rotation on mobile devices
	if (window.innerWidth <= 500) {
		const randomRotation = Math.random() * 180 - 90;
		paragraph.style.transform = `rotate(${randomRotation}deg)`;
	}

	// Optional: Setup mobile links (if any exist)
	function setupMobileLinks() {
		const mobileLinks = document.querySelectorAll("a.mob-link");
		if (mobileLinks.length === 0) {
			console.log("No mobile links found");
			return;
		}
	}
	setupMobileLinks();

	// Optional: Toggle project titles on mobile (if applicable)
	function setupMobileProjectTitlesToggle() {
		const mobileProjectTitles = document.querySelectorAll(
			"p.project-title-mob"
		);
		mobileProjectTitles.forEach((title) => {
			let touchStartY = 0;
			let touchEndY = 0;
			const threshold = 10; // Tap vs. scroll threshold

			title.addEventListener("touchstart", (event) => {
				touchStartY = event.touches[0].clientY;
			});
			title.addEventListener("touchend", (event) => {
				touchEndY = event.changedTouches[0].clientY;
				if (Math.abs(touchStartY - touchEndY) < threshold) {
					const projectWrapper = title.closest(".project-wrapper");
					const projectContent =
						projectWrapper.querySelector(".project-content");
					if (projectContent) {
						const isDisplayed = projectContent.style.display === "flex";
						projectContent.style.display = isDisplayed ? "none" : "flex";
						projectContent.style.maxWidth = isDisplayed ? "0" : "max-content";
					}
				}
			});
		});
	}
	setupMobileProjectTitlesToggle();

	// Desktop: Dynamic rotation based on mouse position
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
			paragraph.style.transform = `rotate(${rotation}deg)`;
		});
	}

	// Mobile: Touch-based snap scrolling
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
					allowScrolling();
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

	// Activate scroll-based snap on desktop
	function activateScrollListener() {
		window.addEventListener("wheel", function (event) {
			if (event.deltaY > 0 && !snapCompleted) {
				sectionWrap.style.transform = "translateY(0)";
				snapCompleted = true;
				mainText.style.opacity = "0";
				allowScrolling();
			}
		});
	}

	// Enable vertical scrolling within sectionWrap
	function allowScrolling() {
		sectionWrap.style.overflowY = "auto";
	}

	// Mobile: Attach click handler to preview sections so that clicking anywhere navigates to the project link
	if (window.innerWidth <= 500) {
		const previewSections = document.querySelectorAll(".preview-section");
		previewSections.forEach(function (preview) {
			// Assumes the corresponding project anchor is the immediate previous sibling
			const projectAnchor = preview.previousElementSibling;
			if (projectAnchor && projectAnchor.classList.contains("project")) {
				preview.style.cursor = "pointer";
				preview.addEventListener("click", function () {
					window.location.href = projectAnchor.href;
				});
			}
		});
	}

	// (Re)Initialize scroll listener (for desktop, if needed)
	activateScrollListener();
});

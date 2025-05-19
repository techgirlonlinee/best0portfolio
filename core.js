let snapCompleted = false;

document.addEventListener("DOMContentLoaded", function () {
	console.log("DOM fully loaded and parsed."); // Debugging: Check if the script is running

	// Prevent browser scroll restoration and reset scroll position
	if ("scrollRestoration" in history) {
		history.scrollRestoration = "manual";
	}
	window.scrollTo(0, 0);

	const sectionWrap = document.querySelector(".section-wrap");
	const mainText = document.querySelector(".main-text");
	const asciiClouds = document.getElementById("ascii-clouds"); // Reference ASCII clouds
	const overviewLink = document.querySelector(".overview-link"); // Reference the overview link

	console.log("sectionWrap:", sectionWrap); // Debugging: Check if sectionWrap is selected
	console.log("mainText:", mainText); // Debugging: Check if mainText is selected
	console.log("asciiClouds:", asciiClouds); // Debugging: Check if asciiClouds is selected
	console.log("overviewLink:", overviewLink); // Debugging: Check if overviewLink is selected

	// Dynamically add a CSS rule with !important
	function addAsciiOpacityRule(opacity) {
		let styleElement = document.getElementById("dynamic-styles");
		if (!styleElement) {
			styleElement = document.createElement("style");
			styleElement.id = "dynamic-styles";
			document.head.appendChild(styleElement);
		}

		// Remove previous rule if it exists
		if (styleElement.sheet.cssRules.length > 0) {
			styleElement.sheet.deleteRule(0);
		}

		// Add new rule with the desired opacity
		styleElement.sheet.insertRule(
			`#ascii-clouds { opacity: ${opacity} !important; transition: opacity 0.5s ease-out !important; }`,
			0
		);

		console.log(`ASCII clouds opacity set to: ${opacity}`);
	}

	// Check if the URL contains the scrollTo=projects parameter
	const urlParams = new URLSearchParams(window.location.search);
	const scrollTo = urlParams.get("scrollTo");

	if (scrollTo === "projects") {
		console.log(
			"Navigated with scrollTo=projects. Bringing section-wrap into view."
		);
		// Bring the section-wrap into view immediately
		sectionWrap.style.transform = "translateY(0)";
		mainText.style.transition = "opacity 0.1s ease-out"; // Faster fade
		mainText.style.opacity = "0";

		if (asciiClouds) {
			addAsciiOpacityRule(0.2); // Reduce ASCII clouds opacity
		} else {
			console.error("ASCII clouds element not found!");
		}

		snapCompleted = true; // Mark snap as completed
	} else {
		// Default behavior: Set initial position and transitions
		if (sectionWrap) {
			sectionWrap.style.transform = "translateY(80vh)";
		}
		if (mainText) {
			mainText.style.transition = "opacity 0.1s ease-out"; // Faster fade
			mainText.style.opacity = "1";
		}
	}

	// Activate scroll-based snap on desktop
	function activateScrollListener() {
		let lastScrollY = window.scrollY;

		window.addEventListener("wheel", function (event) {
			const currentScrollY = window.scrollY;

			if (event.deltaY > 0 && !snapCompleted) {
				// Scrolling down
				sectionWrap.style.transform = "translateY(0)";
				snapCompleted = true;

				// Fade out main text
				mainText.style.opacity = "0";

				// Reduce ASCII clouds opacity
				addAsciiOpacityRule(0.2);
			} else if (event.deltaY < 0 && snapCompleted) {
				// Scrolling up
				sectionWrap.style.transform = "translateY(80vh)";
				snapCompleted = false;

				// Restore main text opacity
				mainText.style.opacity = "1";

				// Restore ASCII clouds opacity
				addAsciiOpacityRule(1);
			}

			lastScrollY = currentScrollY;
		});
	}

	// Enable vertical scrolling within sectionWrap
	function allowScrolling() {
		sectionWrap.style.overflowY = "auto";
	}

	// Mobile: Handle touch-based scrolling
	if (window.innerWidth <= 500) {
		let startY;
		document.body.style.touchAction = "none";

		const touchStartHandler = function (event) {
			if (!snapCompleted) {
				startY = event.touches[0].clientY;
			}
		};

		const touchMoveHandler = function (event) {
			const currentY = event.touches[0].clientY;

			if (!snapCompleted && currentY < startY) {
				// Scrolling down
				sectionWrap.style.transform = "translateY(0)";
				snapCompleted = true;

				// Fade out main text
				mainText.style.opacity = "0";

				// Reduce ASCII clouds opacity
				addAsciiOpacityRule(0.2);

				document.body.style.touchAction = "auto";
			} else if (snapCompleted && currentY > startY) {
				// Scrolling up
				sectionWrap.style.transform = "translateY(80vh)";
				snapCompleted = false;

				// Restore main text opacity
				mainText.style.opacity = "1";

				// Restore ASCII clouds opacity
				addAsciiOpacityRule(1);
			}
		};

		window.addEventListener("touchstart", touchStartHandler);
		window.addEventListener("touchmove", touchMoveHandler);
	} else {
		activateScrollListener();
	}

	// Add functionality for the overview link
	if (overviewLink) {
		overviewLink.addEventListener("click", (event) => {
			sectionWrap.style.transform = "translateY(0)";
			snapCompleted = true;
			mainText.style.opacity = "0";
			addAsciiOpacityRule(0.2); // Reduce ASCII clouds opacity
		});
	}

	// Activate scroll listener
	activateScrollListener();
});

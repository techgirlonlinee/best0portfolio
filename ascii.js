// ASCII Cloud Generator
let cols, rows; // Grid dimensions
const cloudDiv = document.getElementById("ascii-clouds");
let offsetX = 0; // Horizontal offset for noise scrolling
let offsetY = 0; // Vertical offset for noise scrolling
const clearedAreas = []; // Array to store cleared areas
const clearingDuration = 100; // How long a cleared area stays cleared (in frames)

// Function to calculate grid dimensions based on window size
const calculateGrid = () => {
	const fontSize = 8; // Font size in pixels
	const charWidth = fontSize * 0.6; // Approximate width of a monospace character
	const charHeight = fontSize; // Height of a monospace character

	cols = Math.ceil(window.innerWidth / charWidth) + 5; // Add buffer columns for overlap
	rows = Math.ceil(window.innerHeight / charHeight) + 5; // Add buffer rows for overlap
};

// Generate Perlin-like noise for smooth, organic transitions
const generateNoise = (x, y, offsetX, offsetY) => {
	const frequency = 0.07; // Controls the "size" of the clouds
	const randomness =
		Math.sin((x + offsetX) * frequency) * Math.cos((y + offsetY) * frequency);
	const irregularity = Math.sin((y + offsetX / 2) * frequency * 0.5); // Add irregularity
	const variation = Math.sin((x - y + offsetX) * frequency * 0.7); // Add more randomness
	return (randomness + irregularity + variation + 1.5) / 3; // Normalize to 0-1
};

// Map noise values to ASCII symbols with varied shapes
const mapToSymbol = (value) => {
	if (value > 0.9) return "O"; // Dense core
	if (value > 0.8) return "@"; // Dense but textured
	if (value > 0.7) return "#"; // Mid-density
	if (value > 0.6) return "&"; // Irregular dense shape
	if (value > 0.5) return ","; // Mid-density, softer
	if (value > 0.4) return "/"; // Lighter area
	if (value > 0.3) return "~"; // Lighter, flowing
	if (value > 0.2) return ":"; // Very light area
	if (value > 0.1) return "`"; // Faint edges
	return " "; // Empty space
};

// Generate the ASCII cloud grid
const generateClouds = () => {
	let asciiArt = "";
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			// Calculate the base noise value
			let noiseValue = generateNoise(x, y, offsetX, offsetY);

			// Check if the current position is within a cleared area
			for (let i = 0; i < clearedAreas.length; i++) {
				const { cx, cy, remainingFrames } = clearedAreas[i];
				const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
				if (dist < 5) {
					// Reduce noise value in cleared areas
					const influence =
						(1 - dist / 5) * (remainingFrames / clearingDuration);
					noiseValue = Math.max(0, noiseValue - influence * 0.8);
					break;
				}
			}

			asciiArt += mapToSymbol(noiseValue);
		}
		asciiArt += "\n"; // Newline for the next row
	}
	cloudDiv.textContent = asciiArt; // Faster rendering with textContent
};

// Update the clouds and move them in multiple directions
const updateClouds = () => {
	offsetX += 0.3; // Slower horizontal movement
	offsetY += 0.2; // Slower vertical movement

	// Decrease the remaining frames for cleared areas
	for (let i = clearedAreas.length - 1; i >= 0; i--) {
		clearedAreas[i].remainingFrames -= 1;
		if (clearedAreas[i].remainingFrames <= 0) {
			// Remove areas that have fully faded back
			clearedAreas.splice(i, 1);
		}
	}

	generateClouds();
	requestAnimationFrame(updateClouds); // Smooth animation loop
};

// Track mouse movement and create cleared areas
window.addEventListener("mousemove", (e) => {
	const fontSize = 8; // Font size in pixels
	const charWidth = fontSize * 0.6; // Approximate width of a monospace character
	const charHeight = fontSize; // Height of a monospace character

	// Convert mouse position to grid coordinates
	const cx = Math.floor(e.clientX / charWidth);
	const cy = Math.floor(e.clientY / charHeight);

	// Add a new cleared area
	clearedAreas.push({ cx, cy, remainingFrames: clearingDuration });
});

// Recalculate grid dimensions on window resize
window.addEventListener("resize", () => {
	calculateGrid();
	generateClouds(); // Regenerate clouds to fit the new dimensions
});

// Initialize the grid and start the animation
calculateGrid();
updateClouds();

document.addEventListener("DOMContentLoaded", () => {
	const asciiClouds = document.getElementById("ascii-clouds");
	const projectsSection = document.getElementById("projects");

	if (!asciiClouds || !projectsSection) {
		console.error("Missing required elements: #ascii-clouds or #projects");
		return;
	}

	const adjustAsciiOpacity = () => {
		const projectsRect = projectsSection.getBoundingClientRect();
		const windowHeight = window.innerHeight;

		console.log("projectsRect.top:", projectsRect.top);
		console.log("windowHeight:", windowHeight);

		if (projectsRect.top <= windowHeight && projectsRect.top > 0) {
			// Adjust the opacity calculation for a stronger fade effect
			const opacity = Math.max(0.2, (projectsRect.top / windowHeight) ** 2);
			console.log("Setting opacity to:", opacity);
			asciiClouds.style.opacity = opacity;
		} else if (projectsRect.top <= 0) {
			asciiClouds.style.opacity = 0.2; // Fully faded
		} else {
			asciiClouds.style.opacity = 1; // Fully visible
		}
	};

	window.addEventListener("scroll", () => {
		console.log("Scroll event detected"); // Debugging
		adjustAsciiOpacity();
	});

	adjustAsciiOpacity(); // Initial adjustment
});

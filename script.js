document.addEventListener("DOMContentLoaded", () => {
	const projects = document.querySelectorAll(".project");
	const previewSection = document.getElementById("desktop-preview-section");
	const previewImage = document.getElementById("desktop-preview-image");
	const previewDescription = document.getElementById(
		"desktop-preview-description"
	);

	projects.forEach((project, index) => {
		project.addEventListener("mouseover", () => {
			const image = project.getAttribute("data-image");
			const description = project.getAttribute("data-description");

			previewImage.src = image;
			previewDescription.textContent = description;

			previewSection.style.display = "block";
		});

		project.addEventListener("mouseout", () => {
			previewSection.style.display = "none";
		});

		// Display the preview section inline on mobile
		const previewSectionInline = document.getElementById(
			`preview-section-${index + 1}`
		);
		if (window.innerWidth <= 768) {
			const image = project.getAttribute("data-image");
			const description = project.getAttribute("data-description");

			const imgElement = previewSectionInline.querySelector("img");
			const pElement = previewSectionInline.querySelector("p");

			imgElement.src = image;
			pElement.textContent = description;

			previewSectionInline.style.display = "block";
		}
	});
});

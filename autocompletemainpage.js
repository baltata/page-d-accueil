const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const inputElement = document.querySelector('#autoComplete');
            if (inputElement) {
                observer.disconnect(); // Stop observing once found
                const autoCompleteJS = new autoComplete({
					data: {
						src: async () => {
							try {
								// Loading placeholder text
								document
									.getElementById("autoComplete")
									.setAttribute("placeholder", "Loading...");
								// Fetch External Data Source
								const source = await fetch(
									"https://cdn.jsdelivr.net/gh/baltata/chapterlist@98913d4eb91a3249f31dcab84f76cecdff858e45/level.json"
								);
								const data = await source.json();
								// Post Loading placeholder text
								document
									.getElementById("autoComplete")
									.setAttribute("placeholder", autoCompleteJS.placeHolder);
								// Returns Fetched data
								return data;
							} catch (error) {
								return error;
							}
						},
						keys: ["chapter"],
						cache: true,
						filter: (list) => {
							// Filter duplicates
							// incase of multiple data keys usage
							const filteredResults = Array.from(
								new Set(list.map((value) => value.match))
							).map((food) => {
								return list.find((value) => value.match === food);
							});
				
							return filteredResults;
						}
					},
					placeHolder: "Polynôme du second deg...",
					resultsList: {
						element: (list, data) => {
							const info = document.createElement("p");
							if (data.results.length > 0) {
								info.innerHTML = `Il existe <strong>${data.results.length}</strong> resultats sur <strong>${data.matches.length}</strong>`;
							} else {
								info.innerHTML = `Il y a <strong>${data.matches.length}</strong> resultats pour <strong>"${data.query}"</strong>`;
							}
							list.prepend(info);
						},
						noResults: true,
						maxResults: 15,
						tabSelect: true
					},
					resultItem: {
					element: (item, data) => {
						// Modify Results Item Style
						item.style = "display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee;";
						// Modify Results Item Content to include a clickable link
						item.innerHTML = `
						<span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; max-width: 70%;">
						  <a href="${data.value.link}" target="_blank" style="text-decoration: none; color: #007bff;">${data.match}</a>
						</span>
						<span style="display: flex; align-items: center; font-size: 13px; font-weight: 100; text-transform: uppercase; color: rgba(0,0,0,.2);">
						  ${data.value.niveau}
						</span>`;
					},
						highlight: true
					},
					events: {
						input: {
							focus: () => {
								if (autoCompleteJS.input.value.length) autoCompleteJS.start();
							}
						}
					}
				});
				
				// autoCompleteJS.input.addEventListener("init", function (event) {
				//   console.log(event);
				// });
				
				// autoCompleteJS.input.addEventListener("response", function (event) {
				//   console.log(event.detail);
				// });
				
				// autoCompleteJS.input.addEventListener("results", function (event) {
				//   console.log(event.detail);
				// });
				
				// autoCompleteJS.input.addEventListener("open", function (event) {
				//   console.log(event.detail);
				// });
				
				// autoCompleteJS.input.addEventListener("navigate", function (event) {
				//   console.log(event.detail);
				// });
				
				autoCompleteJS.input.addEventListener("selection", function (event) {
					const feedback = event.detail;
					autoCompleteJS.input.blur();
					// Prepare User's Selected Value
					const selection = feedback.selection.value[feedback.selection.key];
					// Render selected choice to selection div
					document.querySelector(".selection").innerHTML = selection;
					// Replace Input value with the selected value
					autoCompleteJS.input.value = selection;
					// Console log autoComplete data feedback
					console.log(feedback);
				});
				
				// autoCompleteJS.input.addEventListener("close", function (event) {
				//   console.log(event.detail);
				// });
				
				// Toggle Search Engine Type/Mode
				document.querySelector(".toggler").addEventListener("click", () => {
					// Holds the toggle button selection/alignment
					const toggle = document.querySelector(".toggle").style.justifyContent;
				
					if (toggle === "flex-start" || toggle === "") {
						// Set Search Engine mode to Loose
						document.querySelector(".toggle").style.justifyContent = "flex-end";
						document.querySelector(".toggler").innerHTML = "Loose";
						autoCompleteJS.searchEngine = "loose";
					} else {
						// Set Search Engine mode to Strict
						document.querySelector(".toggle").style.justifyContent = "flex-start";
						document.querySelector(".toggler").innerHTML = "Strict";
						autoCompleteJS.searchEngine = "strict";
					}
				});
				
				// Blur/unBlur page elements
				const action = (action) => {
					const title = document.querySelector("h1");
					const mode = document.querySelector(".mode");
					const selection = document.querySelector(".selection");
					const footer = document.querySelector(".footer");
				
					if (action === "dim") {
						title.style.opacity = 1;
						mode.style.opacity = 1;
						selection.style.opacity = 1;
					} else {
						title.style.opacity = 0.3;
						mode.style.opacity = 0.2;
						selection.style.opacity = 0.1;
					}
				};
				
				// Blur/unBlur page elements on input focus
				["focus", "blur"].forEach((eventType) => {
					autoCompleteJS.input.addEventListener(eventType, () => {
						// Blur page elements
						if (eventType === "blur") {
							action("dim");
						} else if (eventType === "focus") {
							// unBlur page elements
							action("light");
						}
					});
				});
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });














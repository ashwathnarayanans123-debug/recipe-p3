// =========================
//  RECIPE APP MODULE (IIFE)
// =========================
const RecipeApp = (() => {

    console.log("RecipeApp initializing...");

    // --------------------------
    //   RECIPE DATA (Part 3)
    // --------------------------
    const recipes = [
        {
            id: 1,
            title: "Pasta Alfredo",
            difficulty: "easy",
            time: 20,
            ingredients: ["Pasta", "Cream", "Cheese", "Salt", "Pepper"],
            steps: [
                "Boil pasta",
                {
                    text: "Prepare sauce",
                    substeps: [
                        "Heat butter",
                        "Add cream",
                        "Stir cheese"
                    ]
                },
                "Mix pasta with sauce",
                "Serve hot"
            ]
        },
        {
            id: 2,
            title: "Chicken Curry",
            difficulty: "medium",
            time: 45,
            ingredients: ["Chicken", "Onion", "Garlic", "Masala", "Oil"],
            steps: [
                "Heat oil",
                "Fry onions",
                {
                    text: "Prepare masala",
                    substeps: [
                        "Add tomato",
                        "Add spices",
                        {
                            text: "Blend mixture",
                            substeps: ["Cool down", "Blend to paste"]
                        }
                    ]
                },
                "Add chicken",
                "Cook until done"
            ]
        },
        {
            id: 3,
            title: "Paneer Tikka",
            difficulty: "medium",
            time: 35,
            ingredients: ["Paneer", "Curd", "Masala", "Capsicum"],
            steps: ["Cut paneer", "Mix with curd", "Add spices", "Grill pieces"]
        },
        {
            id: 4,
            title: "Grilled Sandwich",
            difficulty: "easy",
            time: 10,
            ingredients: ["Bread", "Butter", "Veggies", "Chutney"],
            steps: ["Butter bread", "Add veggies", "Grill sandwich"]
        },
        {
            id: 5,
            title: "Biryani",
            difficulty: "hard",
            time: 60,
            ingredients: ["Rice", "Chicken", "Masala", "Mint", "Curd"],
            steps: ["Boil rice", "Cook chicken", "Layer rice + chicken", "Slow cook"]
        },
        {
            id: 6,
            title: "Maggi Masala",
            difficulty: "easy",
            time: 5,
            ingredients: ["Maggi", "Water", "Masala"],
            steps: ["Boil water", "Add noodles", "Add masala", "Cook 2 minutes"]
        },
        {
            id: 7,
            title: "Sushi Roll",
            difficulty: "hard",
            time: 50,
            ingredients: ["Rice", "Seaweed", "Cucumber", "Crab sticks"],
            steps: ["Cook rice", "Prepare roll", "Cut pieces"]
        },
        {
            id: 8,
            title: "Fried Rice",
            difficulty: "easy",
            time: 25,
            ingredients: ["Rice", "Carrot", "Beans", "Soy sauce"],
            steps: ["Heat oil", "Add veggies", "Add rice", "Mix well"]
        }
    ];

    // --------------------------
    //   STATE
    // --------------------------
    let currentFilter = "all";
    let currentSort = "none";

    // --------------------------
    //   DOM REFERENCES
    // --------------------------
    const recipeContainer = document.getElementById("recipe-container");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const sortButtons = document.querySelectorAll(".sort-btn");

    // --------------------------
    //   FILTER FUNCTIONS
    // --------------------------
    const applyFilter = (list, filter) => {
        if (filter === "all") return list;
        if (filter === "quick") return list.filter(r => r.time < 30);
        return list.filter(r => r.difficulty === filter);
    };

    // --------------------------
    //   SORT FUNCTIONS
    // --------------------------
    const sortByName = list => [...list].sort((a, b) => a.title.localeCompare(b.title));
    const sortByTime = list => [...list].sort((a, b) => a.time - b.time);

    const applySort = (list, sortType) => {
        if (sortType === "name") return sortByName(list);
        if (sortType === "time") return sortByTime(list);
        return list;
    };

    // --------------------------
    //   RECURSIVE STEP RENDERER
    // --------------------------
    const renderSteps = (steps, level = 0) => {
        let html = "";

        steps.forEach(step => {
            if (typeof step === "string") {
                html += `<div class="step-item" style="margin-left:${level * 15}px;">
                            • ${step}
                         </div>`;
            } else {
                html += `<div class="step-item" style="margin-left:${level * 15}px;">
                            ➤ ${step.text}
                         </div>`;
                html += renderSteps(step.substeps, level + 1);
            }
        });

        return html;
    };

    // --------------------------
    //   CREATE CARD HTML
    // --------------------------
    const createRecipeCard = (recipe) => {
        return `
            <div class="recipe-card">
                <h3>${recipe.title}</h3>
                <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
                <p><strong>Time:</strong> ${recipe.time} min</p>

                <button class="toggle-btn" data-toggle="steps" data-id="${recipe.id}">
                    Show Steps
                </button>
                <button class="toggle-btn" data-toggle="ingredients" data-id="${recipe.id}">
                    Show Ingredients
                </button>

                <div class="steps-container" id="steps-${recipe.id}">
                    <h4>Steps:</h4>
                    ${renderSteps(recipe.steps)}
                </div>

                <div class="ingredients-container" id="ingredients-${recipe.id}">
                    <h4>Ingredients:</h4>
                    <ul>
                        ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
                    </ul>
                </div>
            </div>
        `;
    };

    // --------------------------
    //   RENDER ALL RECIPES
    // --------------------------
    const renderRecipes = (list) => {
        recipeContainer.innerHTML = list.map(createRecipeCard).join("");
    };

    // --------------------------
    //   UPDATE ACTIVE STATES
    // --------------------------
    const updateButtonStates = () => {
        filterButtons.forEach(b => b.classList.toggle("active", b.dataset.filter === currentFilter));
        sortButtons.forEach(b => b.classList.toggle("active", b.dataset.sort === currentSort));
    };

    // --------------------------
    //   MAIN DISPLAY FUNCTION
    // --------------------------
    const updateDisplay = () => {
        let list = [...recipes];
        list = applyFilter(list, currentFilter);
        list = applySort(list, currentSort);
        renderRecipes(list);
    };

    // --------------------------
    //   EVENT DELEGATION (TOGGLES)
    // --------------------------
    const setupToggleHandler = () => {
        recipeContainer.addEventListener("click", (e) => {
            if (!e.target.classList.contains("toggle-btn")) return;

            const id = e.target.dataset.id;
            const type = e.target.dataset.toggle;
            const container = document.getElementById(`${type}-${id}`);

            container.classList.toggle("visible");
            e.target.textContent = container.classList.contains("visible")
                ? `Hide ${type.charAt(0).toUpperCase() + type.slice(1)}`
                : `Show ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        });
    };

    // --------------------------
    //   FILTER + SORT LISTENERS
    // --------------------------
    const setupFilterSortListeners = () => {
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                currentFilter = btn.dataset.filter;
                updateButtonStates();
                updateDisplay();
            });
        });

        sortButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                currentSort = btn.dataset.sort;
                updateButtonStates();
                updateDisplay();
            });
        });
    };

    // --------------------------
    //   INIT FUNCTION (PUBLIC)
    // --------------------------
    const init = () => {
        updateDisplay();
        updateButtonStates();
        setupFilterSortListeners();
        setupToggleHandler();
        console.log("RecipeApp ready!");
    };

    return { init };

})();

// Start App
RecipeApp.init();


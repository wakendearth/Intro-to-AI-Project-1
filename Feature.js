/*
 * Feature.js
 * Card Gallery features for the MTG Card Gallery site:
 *   1. Load the card data from StandardAtomic.json (MTGJSON atomic format).
 *   2. Show the cards in the 3x3 grid in order, first to last.
 *   3. Filter the cards with the White, Blue, Black, Red and Green toggle buttons.
 *      Only cards whose colors exactly match the enabled buttons are shown.
 *      With no buttons enabled, every card is shown.
 *   4. Move through the cards 9 at a time with the page numbers under the grid.
 */

const CARD_DATA_FILE = "StandardAtomic.json";
const CARDS_PER_PAGE = 9;

// The five colors in the order the buttons appear. Each code matches MTGJSON's "colors" values.
const MTG_COLORS = [
    { code: "W", name: "White" },
    { code: "U", name: "Blue" },
    { code: "B", name: "Black" },
    { code: "R", name: "Red" },
    { code: "G", name: "Green" }
];

// Page state shared by the functions below
const galleryState = {
    allCards: [],            // every card from the JSON file, in file order
    filteredCards: [],       // cards that match the current color filter
    enabledColors: new Set(),// color codes whose buttons are switched on
    currentPage: 1
};

/* ---------- Retrieving cards from the JSON file ---------- */

// Fetch StandardAtomic.json and return its list of cards.
async function fetchCardData(url = CARD_DATA_FILE) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Could not load " + url + " (HTTP " + response.status + ")");
    }
    return parseCardData(await response.text());
}

// Turn the raw JSON text into an ordered list of simple card objects.
function parseCardData(jsonText) {
    // Some editors save the file with a byte order mark, which JSON.parse rejects
    const json = JSON.parse(jsonText.replace(/^﻿/, ""));
    const data = json.data || {};

    // In the atomic format each key is a card name and its value is a list of faces
    return Object.keys(data).map(function (cardName) {
        return buildCard(cardName, data[cardName]);
    });
}

// Build the card object the gallery uses from a card's list of faces.
function buildCard(cardName, faces) {
    const front = faces[0] || {};
    return {
        name: cardName,
        colors: getCardColors(front),
        type: front.type || "",
        imageUrl: getCardImageUrl(cardName)
    };
}

// A card's colors come from its front face. Colorless cards have an empty list.
function getCardColors(face) {
    return Array.isArray(face.colors) ? face.colors.slice() : [];
}

// The JSON has no images, so the picture is fetched from Scryfall by card name.
function getCardImageUrl(cardName) {
    return "https://api.scryfall.com/cards/named?format=image&version=normal&exact=" +
        encodeURIComponent(cardName);
}

/* ---------- Filtering and paging ---------- */

// True when the card's colors are exactly the enabled colors (no more, no fewer).
function matchesColorFilter(card, enabledColors) {
    if (enabledColors.size === 0) {
        return true; // nothing selected: show every card
    }
    if (card.colors.length !== enabledColors.size) {
        return false;
    }
    return card.colors.every(function (color) {
        return enabledColors.has(color);
    });
}

// Keep the cards that match the filter, in their original order.
function filterCards(cards, enabledColors) {
    return cards.filter(function (card) {
        return matchesColorFilter(card, enabledColors);
    });
}

function getTotalPages(cards) {
    return Math.max(1, Math.ceil(cards.length / CARDS_PER_PAGE));
}

// The (up to) 9 cards that belong on a given page, counting pages from 1.
function getPageOfCards(cards, pageNumber) {
    const start = (pageNumber - 1) * CARDS_PER_PAGE;
    return cards.slice(start, start + CARDS_PER_PAGE);
}

/* ---------- Drawing the page ---------- */

// Fill the 9 grid slots with the cards for the current page.
function renderGrid() {
    const grid = document.getElementById("card-grid");
    const slots = grid.querySelectorAll(".card-slot");
    const cards = getPageOfCards(galleryState.filteredCards, galleryState.currentPage);

    slots.forEach(function (slot, index) {
        slot.innerHTML = "";
        const card = cards[index];
        if (!card) {
            slot.classList.add("empty");
            return;
        }
        slot.classList.remove("empty");

        const img = document.createElement("img");
        img.src = card.imageUrl;
        img.alt = card.name;
        img.title = card.name;
        img.loading = "lazy";
        // If an image can't be loaded, show the card's name instead
        img.addEventListener("error", function () {
            slot.innerHTML = "";
            slot.appendChild(makeTextLabel(card.name));
        });
        slot.appendChild(img);
    });

    updateStatus();
}

function makeTextLabel(text) {
    const span = document.createElement("span");
    span.className = "card-placeholder";
    span.textContent = text;
    return span;
}

// Show how many cards match, or a message when none do.
function updateStatus() {
    const status = document.getElementById("gallery-status");
    const total = galleryState.filteredCards.length;
    if (total === 0) {
        status.textContent = "No cards match the selected colors.";
        return;
    }
    const start = (galleryState.currentPage - 1) * CARDS_PER_PAGE + 1;
    const end = Math.min(start + CARDS_PER_PAGE - 1, total);
    status.textContent = "Showing cards " + start + "-" + end + " of " + total;
}

// Choose which page numbers to show: always the first and last pages,
// plus the pages around the current one, with gaps ("...") in between.
function getPageNumbersToShow(currentPage, totalPages) {
    const pages = [];
    for (let page = 1; page <= totalPages; page++) {
        const nearCurrent = Math.abs(page - currentPage) <= 2;
        if (page === 1 || page === totalPages || nearCurrent) {
            pages.push(page);
        } else if (pages[pages.length - 1] !== "...") {
            pages.push("...");
        }
    }
    return pages;
}

// Draw the page number buttons under the grid.
function renderPagination() {
    const nav = document.getElementById("pagination");
    const totalPages = getTotalPages(galleryState.filteredCards);
    const current = galleryState.currentPage;
    nav.innerHTML = "";

    nav.appendChild(makePageButton("Prev", current - 1, current === 1));
    getPageNumbersToShow(current, totalPages).forEach(function (page) {
        if (page === "...") {
            const gap = document.createElement("span");
            gap.className = "page-gap";
            gap.textContent = "...";
            nav.appendChild(gap);
        } else {
            const button = makePageButton(String(page), page, false);
            if (page === current) {
                button.classList.add("current");
                button.setAttribute("aria-current", "page");
            }
            nav.appendChild(button);
        }
    });
    nav.appendChild(makePageButton("Next", current + 1, current === totalPages));
}

function makePageButton(label, targetPage, disabled) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "page-button";
    button.textContent = label;
    button.disabled = disabled;
    button.addEventListener("click", function () {
        goToPage(targetPage);
    });
    return button;
}

function goToPage(pageNumber) {
    const totalPages = getTotalPages(galleryState.filteredCards);
    galleryState.currentPage = Math.min(Math.max(1, pageNumber), totalPages);
    renderGrid();
    renderPagination();
}

// Draw the row of color toggle buttons above the grid.
function renderColorFilters() {
    const container = document.getElementById("color-filters");
    container.innerHTML = "";

    MTG_COLORS.forEach(function (color) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "color-toggle";
        button.dataset.color = color.code;
        button.textContent = color.name;
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", function () {
            toggleColor(color.code, button);
        });
        container.appendChild(button);
    });
}

// Switch a color on or off, then re-filter and go back to the first page.
function toggleColor(colorCode, button) {
    if (galleryState.enabledColors.has(colorCode)) {
        galleryState.enabledColors.delete(colorCode);
    } else {
        galleryState.enabledColors.add(colorCode);
    }
    const isOn = galleryState.enabledColors.has(colorCode);
    button.classList.toggle("on", isOn);
    button.setAttribute("aria-pressed", String(isOn));
    applyFilter();
}

function applyFilter() {
    galleryState.filteredCards = filterCards(galleryState.allCards, galleryState.enabledColors);
    galleryState.currentPage = 1;
    renderGrid();
    renderPagination();
}

/* ---------- Start up ---------- */

// Use a loaded list of cards and draw the gallery.
function startGallery(cards) {
    galleryState.allCards = cards;
    document.getElementById("file-picker").hidden = true;
    applyFilter();
}

// Browsers block fetch() for pages opened straight from disk (file://).
// In that case, let the person pick StandardAtomic.json by hand instead.
function showFilePicker(message) {
    const picker = document.getElementById("file-picker");
    const input = document.getElementById("card-file-input");
    document.getElementById("gallery-status").textContent = message;
    picker.hidden = false;

    input.addEventListener("change", function () {
        const file = input.files[0];
        if (!file) {
            return;
        }
        file.text().then(function (text) {
            startGallery(parseCardData(text));
        }).catch(function (error) {
            document.getElementById("gallery-status").textContent =
                "That file could not be read as card data: " + error.message;
        });
    });
}

async function initGallery() {
    renderColorFilters();
    document.getElementById("gallery-status").textContent = "Loading cards...";
    try {
        startGallery(await fetchCardData());
    } catch (error) {
        console.error(error);
        showFilePicker("The card data could not be loaded automatically. " +
            "Choose StandardAtomic.json below to view the cards.");
    }
}

document.addEventListener("DOMContentLoaded", initGallery);

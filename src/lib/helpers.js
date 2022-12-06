export function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

// Preferred sort order for different categories. Used by filters and demographics charts
export const raceOrder = ["WHITE", "BLACK", "HISPANIC", "ASIAN", "AMERICAN INDIAN", "MULTI", "OTHER"]
export const regionOrder = ["Minneapolis", "St. Paul", "Metro", "Outstate"]
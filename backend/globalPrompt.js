export const generatePrompt = (brandPositioning, features, tone, length) => {
    const lengthMapping = {
        'Short': '4-6 sentences',
        'Medium': '8-10 sentences',
        'Long': '15-20 sentences'
    };

    return `You are a copywriter at a marketing agency working on a brochure for a real estate developer.
    Generate a narrative flow for the real estate brochure keeping in mind the brand positioning and features of the property.
    <BRAND POSITIONING>
    ${brandPositioning}
    </BRAND POSITIONING>
    <FEATURES>
    ${features}
    </FEATURES>
    Keep the tone of the narrative ${tone}
    Also make sure that the length of the copy is ${lengthMapping[length]}`;
};

export const regeneratePrompt = (output, selectedText, modificationOption) => {
    return `Please regenerate the narrative flow by modifying ONLY the selected portion of the complete text.
    Do not regenerate any other aspect of the complete text and ONLY give the output.

    <COMPLETE TEXT>
    ${output}
    </COMPLETE TEXT>
    <SELECTED PORTION>
    ${selectedText}
    </SELECTED PORTION>
    Please make the text of the selected portion ${modificationOption}
    Generate and return the complete text containing the modification, without providing any other information or sentences.`;
};

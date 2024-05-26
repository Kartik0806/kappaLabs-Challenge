import React, { useState } from 'react';
import axios from 'axios';

const ChatbotForm = () => {
    const [brandPositioning, setBrandPositioning] = useState('');
    const [features, setFeatures] = useState('');
    const [tone, setTone] = useState('Casual');
    const [length, setLength] = useState('Short');
    const [output, setOutput] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [modificationOption, setModificationOption] = useState('');


// Generation of output (API)
    const handleGenerate = async () => {
        const payload = {
            brandPositioning,
            features,
            tone,
            length
        };

        try {
            const response = await axios.post('http://localhost:5000/generate', payload);
            setOutput(response.data.result);
        } catch (error) {
            console.error('Error generating response:', error);
            setOutput('Failed to generate response.');
        }
    };

// Insertion in Supabase DB (API)
    const handleInsertDB = async () => {
        const payload = {
            brandPositioning,
            features,
            tone,
            length,
            generatedCopy: output
        };

        try {
            const response = await axios.post('http://localhost:5000/insert', payload);
            alert(response.data.message);
        } catch (error) {
            console.error('Error inserting data:', error);
            alert('Failed to insert data.');
        }
    };

// Handles regeneration dropdown option
    const handleMouseDown = (e) => { 
        if (selectedText) {
            // console.log("blah")
            // console.log(selectedText)
            setDropdownVisible((!dropdownVisible));
        }
    }

// handles selected text for regeneration
    const handleTextSelection = (e) => {
        const textarea = e.target;
        const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        setSelectedText(selectedText);
        if (selectedText) {
            // console.log(dropdownVisible)
            // console.log(selectedText)
            const rect = textarea.getBoundingClientRect();
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;

            // Calculate the position of the dropdown
            const textBeforeSelection = textarea.value.substring(0, startPos);
            const lines = textBeforeSelection.split('\n');
            const selectionLineIndex = lines.length - 1;
            const selectionColumnIndex = lines[selectionLineIndex].length;

            const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight, 10);
            const top = rect.top + window.scrollY + (selectionLineIndex + 1) * lineHeight;
            const left = rect.left + window.scrollX + selectionColumnIndex * (textarea.scrollWidth / textarea.cols);

            setDropdownPosition({ top, left });
            setDropdownVisible(true);
        } 
    };

// handles regenration of output (API)
    const handleRegenerate = async () => {
        const payload = {
            selectedText,
            output,
            modificationOption
        };

        alert(selectedText)
        try {
            const response = await axios.post('http://localhost:5000/regenerate', payload);
            setOutput(response.data.result);
        } catch (error) {
            console.error('Error regenerating text:', error);
            alert('Failed to regenerate text.');
        }
        setSelectedText('')
    };

// handles regenration options
    const handleModificationOptionChange = (e) => {
        setModificationOption(e.target.value);
        alert("changed")
        handleRegenerate();
        setDropdownVisible(false);
        setModificationOption('');

    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Reference Front End</h2>
            <div style={{ marginBottom: '15px' }}>
                <label>
                    Input A: Brand Positioning
                    <input
                        type="text"
                        value={brandPositioning}
                        onChange={(e) => setBrandPositioning(e.target.value)}
                        style={{ display: 'block', width: '100%', marginTop: '5px' }}
                    />
                </label>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label>
                    Input B: Features
                    <input
                        type="text"
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
                        style={{ display: 'block', width: '100%', marginTop: '5px' }}
                    />
                </label>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label>
                    Input C: Tone
                    <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ display: 'block', width: '100%', marginTop: '5px' }}>
                        <option value="Casual">Casual</option>
                        <option value="Formal">Formal</option>
                        <option value="Grandiose">Grandiose</option>
                    </select>
                </label>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label>
                    Input D: Length
                    <select value={length} onChange={(e) => setLength(e.target.value)} style={{ display: 'block', width: '100%', marginTop: '5px' }}>
                        <option value="Short">Short</option>
                        <option value="Medium">Medium</option>
                        <option value="Long">Long</option>
                    </select>
                </label>
            </div>
            <button onClick={handleGenerate} style={{ display: 'block', margin: 'auto' }}>Generate</button>
            <div style={{ marginTop: '20px', position: 'relative' }}>
                <h3>OUTPUT</h3>
                <textarea
                    id="outputTextarea"
                    value={output}
                    readOnly
                    onMouseUp={handleTextSelection}
                    onMouseDown={handleMouseDown}
                    style={{ width: '100%', height: '150px' }}
                />
                {dropdownVisible && (
                    <div style={{ position: 'absolute', zIndex: 1000, background: 'white', border: '1px solid #ccc', borderRadius: '4px' }}>
                        <select id='dropDownMenu' value={modificationOption} onChange={handleModificationOptionChange} style={{ display: 'block', width: '100%', padding: '5px' }}>
                            <option value="" disabled selected>Select an option</option>
                            <option value="longer">Make it longer</option>
                            <option value="shorter">Make it shorter</option>
                        </select>
                    </div>
                )}
            </div>
            <button onClick={handleInsertDB} style={{ display: 'block', margin: 'auto', marginTop: '20px' }}>Insert in DB</button>
        </div>
    );
};

export default ChatbotForm;


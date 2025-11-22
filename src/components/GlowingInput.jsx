import './GlowingInput.css';

function GlowingInput({
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    required = false,
    autoComplete,
    id,
    minLength,
    min,
    max
}) {
    return (
        <div id="poda">
            <div className="glow"></div>
            <div className="darkBorderBg"></div>
            <div className="darkBorderBg"></div>
            <div className="darkBorderBg"></div>
            <div className="white"></div>
            <div className="border"></div>
            <div id="main">
                <input
                    id={id}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="input"
                    required={required}
                    autoComplete={autoComplete}
                    minLength={minLength}
                    min={min}
                    max={max}
                />
                <div id="input-mask"></div>
                <div id="pink-mask"></div>
            </div>
        </div>
    );
}

export default GlowingInput;
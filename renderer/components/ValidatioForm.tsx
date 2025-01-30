import { useState } from "react";

// Modified form component
const ValidationForm = ({ onValidSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({ title: false, description: false });
    const [shouldShake, setShouldShake] = useState(false);
  
    const validateForm = () => {
      const newErrors = {
        title: title.trim() === '',
        description: description.trim() === ''
      };
      
      setErrors(newErrors);
      
      if (newErrors.title || newErrors.description) {
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 400);
        return false;
      }
      return true;
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
        onValidSubmit();
      }
    };
  
    return (
      <form 
        onSubmit={handleSubmit}
        className={shouldShake ? 'shake' : ''}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors(prev => ({ ...prev, title: false }));
            }}
            style={{ 
              padding: "0.5rem",
              border: `1px solid ${errors.title ? '#ef4444' : '#ccc'}`,
              borderRadius: "0.375rem",
              width: "100%"
            }}
          />
          {errors.title && (
            <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              Title cannot be empty
            </p>
          )}
        </div>
  
        <div>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors(prev => ({ ...prev, description: false }));
            }}
            style={{ 
              padding: "0.5rem",
              border: `1px solid ${errors.description ? '#ef4444' : '#ccc'}`,
              borderRadius: "0.375rem",
              width: "100%"
            }}
          />
          {errors.description && (
            <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              Description cannot be empty
            </p>
          )}
        </div>
  
        <select
          name="priority"
          onChange={() => console.log("priority")}
          style={{ 
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "0.375rem"
          }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
  
        {/* Hidden submit button for Enter key support */}
        <button type="submit" style={{ display: 'none' }} />
      </form>
    );
  };

  export default ValidationForm;
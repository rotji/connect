import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [expectation, setExpectation] = useState('');
  const [country, setCountry] = useState(''); 
  const [state, setState] = useState(''); 
  const [town, setTown] = useState(''); 
  const [address, setAddress] = useState(''); 
  const [details, setDetails] = useState('');
  const [profilePic, setProfilePic] = useState(null);  // State for profile picture
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('category', category);
    formData.append('phone', phone);
    formData.append('interest', interest);
    formData.append('expectation', expectation);
    formData.append('country', country);
    formData.append('state', state);
    formData.append('town', town);
    formData.append('address', address);
    formData.append('details', details);
    if (profilePic) {
      formData.append('profilePic', profilePic);  // Append profile picture
    }

    // Log all user input values
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Category:', category);
    console.log('Phone:', phone);
    console.log('Interest:', interest);
    console.log('Expectation:', expectation);
    console.log('Country:', country);
    console.log('State:', state);
    console.log('Town:', town);
    console.log('Address:', address);
    console.log('Details:', details);
    console.log('Profile Picture:', profilePic ? profilePic.name : 'No file chosen');

    console.log('User data being submitted:', Object.fromEntries(formData));

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        body: formData,  // Use FormData for file upload
      });

      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        setName('');
        setEmail('');
        setPassword('');
        setCategory('');
        setPhone('');
        setInterest('');
        setExpectation('');
        setCountry('');  
        setState('');   
        setTown('');     
        setAddress(''); 
        setDetails(''); 
        setProfilePic(null);  // Reset profile picture
        setMessage('Registration successful!');
        console.log('Registration successful:', data);
      } else {
        const errorMessage = data.msg || 'Registration failed. Please try again.';
        setMessage(errorMessage);
        console.error('Registration failed:', data);
      }
    } catch (error) {
      setMessage('Error during registration: ' + error.message);
      console.error('Error during registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Expectation"
          value={expectation}
          onChange={(e) => setExpectation(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Country"  // New input for country
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="State"  // New input for state
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Town"  // New input for town
          value={town}
          onChange={(e) => setTown(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"  // New input for address
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          required
        />
        <input
          type="file"  // New input for profile picture
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files[0])}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;

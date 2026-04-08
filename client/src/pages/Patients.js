import React, { useEffect, useState } from "react";
import { addPatient, getTests } from "../api";

function Patients() {
  const [form, setForm] = useState({});
  const [tests, setTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);

  useEffect(() => {
    getTests().then(res => setTests(res.data));
  }, []);

  const toggleTest = (id) => {
    setSelectedTests(prev =>
      prev.includes(id)
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  const submit = async () => {
    await addPatient({ ...form, tests: selectedTests });
    alert("Added");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Patient</h2>

      <input placeholder="Name"
        onChange={e => setForm({...form, name: e.target.value})} /><br />

      <input placeholder="Age"
        onChange={e => setForm({...form, age: e.target.value})} /><br />

      <input placeholder="Gender"
        onChange={e => setForm({...form, gender: e.target.value})} /><br />

      <input placeholder="Phone"
        onChange={e => setForm({...form, phone: e.target.value})} /><br />

      <h3>Select Tests</h3>

      {tests.map(t => (
        <div key={t.id}>
          <input
            type="checkbox"
            onChange={() => toggleTest(t.id)}
          />
          {t.test_name} - ₹{t.price}
        </div>
      ))}

      <br />

      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default Patients;
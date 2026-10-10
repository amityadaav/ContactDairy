
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./component/Navbar/Navbar";
import Footer from "./component/Footer/Footer";
import Home from "./component/Home/Home";
import AddContact from "./component/AddContact/AddContact";
import Dashboard from "./component/Dashboard/Dashboard";
import AllContacts from "./component/AllContacts/AllContacts";
import Favorites from "./component/Favorites/Favorites";
import Groups from "./component/Groups/Groups";
import About from "./component/About/About";
import Signup from "./component/Signup/Signup";
import Contact from "./component/Contact/Contact";
import Login from "./component/Login/Login";
import EditContact from "./component/EditContact/EditContact"
function App() {
  return (
    <>
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addContact" element={<AddContact/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/allContacts" element={<AllContacts />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/group" element={<Groups />} />
          <Route path="/contacts" element={<Contact />} />
                  <Route path="/editContact/:id" element={<EditContact />}/>
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;

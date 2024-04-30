const express = require('express')
const router = express.Router()
const User = require('../models/user-model')
const bcrypt = require('bcrypt')

router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, username, password } = req.body
    console.log(req.body)

    if (!firstname || !lastname || !email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required..!' })
    }


    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ message: 'Email is already Exist..!' })
    }

    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: 'Username is already in Exist..!' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      firstname,
      lastname,
      email,
      username,
      password: hashedPassword,
    })
    await newUser.save()
    return res
      .status(201)
      .json({ message: 'User Registered Successfully..!', User: newUser })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})


router.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;
      if (!username || !password) {
          return res.status(400).json({ message: 'Username and password are required..!' });
      }

      const user = await User.findOne({ username });
      if (!user) {
          return res.status(400).json({ message: 'Invalid username or password..!' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          return res.status(400).json({ message: 'Invalid username or password..!' });
      }
      res.status(200).json({ message: 'Login successfully..!', user });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
      const {id}  = req.params;
      if(!id){
          return res.status(400).json({ message: 'User Does Not Exist..!' });
      }
      console.log(id)

        const alluser = await User.find({ _id: { $ne: id } }).select("-password")
          return res.status(200).json(alluser);
          res.status(403).json({ message: 'User is already logged in.' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
  }
});


module.exports = router
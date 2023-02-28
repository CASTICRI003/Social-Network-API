const { User, Thought } = require('../models');

module.exports = {
     // Gets all users
     getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    // Gets user by ID
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Creates a new user
    createUser(req, res) {
        User.create(req.body)
            .then((userDB) => res.json(userDB))
            .catch((err) => res.status(500).json(err));
    },
    // Updates a user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with this ID!' })
                    : res.json(user)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // Deletes a user
    deleteSingleUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user ? res.status(404).json({ message: 'No user with this ID!' })
                    : Thought.deleteMany({ _id: { $in: user.thoughts } })
            )
            .then(() => res.json({ message: 'User and associated thoughts and reactions deleted!' }))
            .catch((err) => res.status(500).json(err));
    },
    // Adds a friend
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { new: true }
        )
        .then((user) =>
        !user
        ? res.status(404).json({ message: 'No user with this ID!' })
        : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Deletes a friend
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId} },
            { new: true }
        )
        .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this ID!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
    },
};
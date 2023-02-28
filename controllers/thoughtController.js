const { User, Thought } = require('../models');

module.exports = {
    //Gets all Thoughts
    getThoughts(req, res) {
        Thought.find()
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
    //Gets one Thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought with that ID.'})
        : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    //Creates a Thought
    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought_id } },
                { new: true }
            );
        })
        .then((user) =>
        !user
        ? res.status(404).json({
            message: 'Thought was created, but found no user with that ID.',
        })
        : res.json('Thought has been created!'))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    //Update a Thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((thought) => 
        !thought
        ? res.status(404).json({ message: 'No Thought with this ID.'})
        : res.json(thought)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    //Deletes a thought
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .then((thought) => 
        !thought
        ? res.status(404).json({ message: 'No thought with this ID.' })
        : User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        )
        )
        .then((user) => 
        !user 
        ? res.status(404).json({ message: 'Thought deleted but no user with this ID.'})
        : res.json({ message: 'Thought successfully deleted!'})
        )
        .catch((err) => res.status(500).json(err));
    },
    //adds a reaction
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought found with this ID!' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    //deletes a reaction
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionsId } } },
            { new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No reaction with this ID!' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};
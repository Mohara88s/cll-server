const { User, OwnDictionary } = require("../../models");
const { BadRequest, NotFound } = require("http-errors");

const removeOwnDictionaryById = async (req, res, next) => {
	const { _id } = req.user;
	const { dictionaryId } = req.params;
	if (!dictionaryId) {
		throw new BadRequest("missing field dictionaryId");
	}

	const user = await User.findById(_id);
	const updatedDictionarys = user.ownDictionarys.filter(
		(e) => `${e}` !== `${dictionaryId}`
	);
	const { ownDictionarys } = await User.findByIdAndUpdate(
		_id,
		{ ownDictionarys: updatedDictionarys },
		{ new: true }
	).populate("ownDictionarys", ["ownDictionaryName", "ownDictionaryTasks"]);
	if (!ownDictionarys) {
		throw new NotFound(`own dictionary with id=${dictionaryId} not found`);
	}

	const { ownDictionaryOwner } = await OwnDictionary.findById(dictionaryId);
	if (`${_id}` === `${ownDictionaryOwner}`) {
		const result = await OwnDictionary.findByIdAndDelete(dictionaryId);
	}

	res.status(200).json({
		ownDictionarys,
	});
};

module.exports = removeOwnDictionaryById;
const express = require('express')
const { controllerWrapper, validation, authenticate } = require('../../middlewares')
const { joiSchema, signinJoiSchema } = require('../../models/user')
const { auth: ctrl } = require('../../controllers')

const router = express.Router()

router.post('/signup', validation(joiSchema), controllerWrapper(ctrl.signup))

router.post('/signin', validation(signinJoiSchema), controllerWrapper(ctrl.signin))

router.get('/signout', authenticate, controllerWrapper(ctrl.signout))

router.post('/password-reset', controllerWrapper(ctrl.passwordResetApplication))

router.put('/password-change/:token', controllerWrapper(ctrl.passwordChange))

module.exports = router

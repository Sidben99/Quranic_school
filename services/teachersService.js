const User = require('../models/userModel');
const School = require('../models/schoolModel');
const SchoolFeatures = require('../utils/schoolFeatures');
const asyncHandler = require('express-async-handler');

exports.getTeachersPage = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const schoolFeatures = new SchoolFeatures(user._id);
  const school = await schoolFeatures.getSchool(user._id);
  const { name, address = {} } = school;
  const { daira } = address;
  const stat = {
    nStudents: await schoolFeatures.getNumberOfStudents(),
    nMales: await schoolFeatures.getNumberOfStudents(
      (students) => students.sex === 'male'
    ),
    nFemales: await schoolFeatures.getNumberOfStudents(
      (students) => students.sex === 'female'
    ),
    nTeachers: await schoolFeatures.getNumberOfTeachers(),
  };
  //console.log('teachers : ', getTeachers(school));
  res.render('teachers.pug', {
    stat,
    teachers: await schoolFeatures.getTeachers(),
    students: await schoolFeatures.getStudents(),
    name,
    daira,
  });
});

exports.createTeacher = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const schoolFeatures = new SchoolFeatures(user._id);
  const {
    fullName,
    type,
    grade,
    isAuthorized = req.body.type === 'employee' ? true : false,
    registrationDate,
  } = req.body;
  // teachers object shape
  const newTeacher = {
    fullName,
    type,
    grade,
    isAuthorized,
    registrationDate,
  };
  console.log('body : ', req.body);
  console.log('new Teacher : ', newTeacher);
  await schoolFeatures.createTeacher(newTeacher);
  res.json({
    msg: 'تمت الاضافة بنجاح',
  });
});

exports.getSpecificTeacher = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const schoolFeatures = new SchoolFeatures(user._id);
  const teacher = await schoolFeatures.getSpecificTeacher(req.params.id);
  res.json({ msg: 'scc', teacher });
});

exports.updateTeacher = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const schoolFeatures = new SchoolFeatures(user._id);
  const {
    fullName,
    type,
    grade,
    isAuthorized = req.body.type === 'employee' ? true : false,
    registrationDate,
  } = req.body;
  // teachers object shape
  const newTeacher = {
    fullName,
    type,
    grade,
    isAuthorized,
    registrationDate,
  };
  await schoolFeatures.updateTeacher(req.params.id, newTeacher);
  res.json({
    msg: 'تم التعديل بنجاح',
  });
});

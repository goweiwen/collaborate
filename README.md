![collaborate!](/public/assets/logo.png)

Project Scope
===
An online collaborative file view and edit web application that supports multiple file types.

Motivation
===
During online group discussion, most of the time we work with multiple files together (ie poster, writing proposal, referring to articles/slides/videos). This can get quite messy and we want to make projects more organized and have common platform that allows users to work on multiple files at the same time.

Idea
===
To simulate a table top discussion for projects/teaching/learning while leveraging on technology.
* [Demo](http://collaborate-app.herokuapp.com/default)
* [Ideation poster](http://imgur.com/a/rIfQm)
* [Ideation video](https://youtu.be/GKMJ62m6eyM)
* [Development Video](https://youtu.be/fPaHSTDO05o)
* [Submission poster](http://imgur.com/a/jAMeL)
* [Submission](https://youtu.be/7TeuZ-MRs1k)

Features
===
- [x] Real time file viewing and editing (similar to google docs)
- [ ] Supports wide range of file types
  - [x] PDF(main lecture slide/tutorial file type) -[ react-pdf](https://github.com/wojtekmaj/react-pdf)
  - [x] Image
  - [x] Video (Youtube)
  - [x] Google Docs
  - [ ] Markdown
  - [ ] HTML
- [x] Draggable and Resizable Tiles -[ react-rnd](https://github.com/bokuweb/react-rnd)
- [x] Drag and Drop Upload -[ react-dropzone-s3-uploader](https://github.com/founderlab/react-dropzone-s3-uploader)
- [ ] Communication channels
- [ ] File System for access to Uploaded Files]
- [x] Whiteboard Annotations
- [x] Multiple Rooms for different groups
- [x] Extensibility - abstract the implementation of tile so that other users can create their own tiles
- [x] Feature Tour -[ react-joyride](https://github.com/gilbarbara/react-joyride)
- [ ] Responsiveness
- [ ] Permissions

Target Uses and Users
===
Project Work
---
Students who are working on projects
* Able to upload different references/sources to aid project discussion.
* Able to view different files that are due for submission side by side.
* Able to discuss project with reference materials flipped to the same pages.

Teaching
---
Platform for tutors to hold an online classroom for teaching.
* Able to upload multiple relevant resources (images, pdfs, videos) to facilitate teaching

How are we different?
===
Differentiate from similar platforms:

eg: Google Docs, Microsoft Office Live

* Supports editing of multiple file types.
* Able to view and edit multiple file types side by side in real time.
* Editable tile layout
* Extensibility: users are able to create their own tiles specific to their project (interpreter, .md reader, image editing tile)

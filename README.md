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
* [Live Demo](http://collaborate-app.herokuapp.com/default)
* [Ideation poster](http://imgur.com/a/rIfQm)
* [Ideation video](https://youtu.be/GKMJ62m6eyM)
* [Development Video](https://youtu.be/fPaHSTDO05o)
* [Submission poster](http://imgur.com/a/jAMeL)
* [Submission](https://youtu.be/7TeuZ-MRs1k)

Features
===
- Real time file viewing and editing (similar to google docs)
- Flexible Tile Layout
- Supports wide range of file types
  - PDF ([react-pdf](https://github.com/wojtekmaj/react-pdf))
  - Image
  - Video (Youtube)
  - Google Docs
  - Text (textarea for edit)
  - Markdown
- Drag and Drop Upload ([react-dropzone-s3-uploader](https://github.com/founderlab/react-dropzone-s3-uploader))
- Toolbar
  - Selection Tool
  - Drag Tool
    - Unlocks layouts to allowing dragging and resize ([react-rnd](https://github.com/bokuweb/react-rnd))
    - Tile information provided on hover
      - owner
      - lastEditBy
      - lastEditTime
  - Whiteboard Annotations
    - [Based on socket io implementation using html canvas](https://github.com/socketio/socket.io/tree/master/examples/whiteboard)
    - Pen with multiple colours
    - Eraser
  - Tile packing
  - Add Tile Form
    - For google doc/spead sheet provide full sharing link
      - https://docs.google.com/document/d/1Xf0bxn-cvB18ycAxP27bDqeYAYq_JqKY6psZoPJuT-E/edit?usp=sharing
    - For youtube, provide end of url
      - https://youtu.be/**7TeuZ-MRs1k**
      - https://www.youtube.com/watch?v=**7TeuZ-MRs1k**
- Multiple Rooms for different groups
  - Home screen allows users to create/access rooms 
  - https://collaborate-app.herokuapp.com/${room_name}
- Extensibility - abstract the implementation of tile so that other users can create their own tiles
- Feature Tour ([react-joyride](https://github.com/gilbarbara/react-joyride))
- Responsiveness

Future Plans
===
- Permissions
- Chat channels

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

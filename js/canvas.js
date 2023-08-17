class drawCanvas {
  constructor(canvas) {
    this.canvas = canvas
    this.objectRender = this.init()
    this.ctx = this.canvas.getContext('2d')
    this.cavH = this.canvas.height
    this.cavW = this.canvas.width
    this.isMsg = 5
    this.isStep1 = 1
  }

  init() {
    return {
      frame: 1,
      manga: 0,
      step1: false,
      step2: false,
      file: null,
      scale: 1,
      x: 0,
      y: 0,
      baseMove: 1,
      baseRotate: 1,
      deg: 0,
      flipV: 1,
      flipH: 1
    }
  }

  getObject() {
    return this.objectRender
  }
  isNum(o) {
    return /^(-?\d+)(\.\d+)?$/.test(o)
  }

  setFile = (file) => {
    this.objectRender.file = file
  }

  setFrame(frame) {
    this.objectRender.frame = frame
  }

  scale(num) {
    if (this.isNum(num)) {
      this.imgScale *= num
      this.draw()
    }
  }

  setStep(bool) {
    if (bool == this.isStep1) {
      this.objectRender.step1 = true
    } else {
      this.objectRender.step2 = true
    }
  }

  setManga(manga) {
    this.objectRender.manga = manga
  }

  getFrameRender(image) {
    let imgWidth = renderImageData[this.objectRender.frame].imgWidth
    let imgHeight = renderImageData[this.objectRender.frame].imgHeight
    let startPointX = renderImageData[this.objectRender.frame].startPoint[0]
    let startPointY = renderImageData[this.objectRender.frame].startPoint[1]
    let rotatePoint = renderImageData[this.objectRender.frame].rotatePoint
    let scale = this.objectRender.scale
    let x = this.objectRender.x
    let y = this.objectRender.y
    /* Resize image */
    let width = 0
    let height = 0

    let posCanvas = imgWidth / imgHeight
    if (posCanvas > 1) {
      width = imgWidth
      height = imgWidth * image.height / image.width
      startPointY += ((imgHeight - height) / 2)
    } else {
      height = imgHeight
      width = imgHeight * image.width / image.height
      startPointX += ((imgWidth - width) / 2)
    }

    return { imgWidth, imgHeight, startPointX, startPointY, rotatePoint, scale, x, y, width, height }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.cavW, this.cavH)
  }

  scaleImage(e) {
    this.objectRender.scale = e
    this.draw()
  }

  moveX(e) {
    this.objectRender.x += e * this.objectRender.baseMove
    this.draw()
  }

  moveY(e) {
    this.objectRender.y += e * this.objectRender.baseMove
    this.draw()
  }

  changeMoveBase = (bool) => {
    if (bool) {
      this.objectRender.baseMove *= 10
    } else {
      this.objectRender.baseMove /= 10
    }
    this.draw()
  }

  changeRotateBase = (bool) => {
    if (bool) {
      this.objectRender.baseRotate *= 10
    } else {
      this.objectRender.baseRotate /= 10
    }
    this.draw()
  }

  rotate(e) {
    this.objectRender.deg += (e * this.objectRender.baseRotate)
    this.draw()
  }
  
  flipV() {
    this.objectRender.flipV *= -1
    this.draw()
  }

  flipH() {
    this.objectRender.flipH *= -1
    this.draw()
  }

  resetCanvas(callback) {
    this.objectRender = {...this.objectRender, 
      scale: 1,
      x: 0,
      y: 0,
      baseMove: 1,
      baseRotate: 1,
      deg: 0,
      flipV: 1,
      flipH: 1
    }
   
    if (callback) {
      callback()
      this.draw()
    }
  }

  renderImage(image) {
    this.clearCanvas()
    this.ctx.save()
    let size = this.getFrameRender(image)
    // First translate the context to the center you wish to rotate around.
    this.ctx.translate(size.x, size.y);
    this.ctx.translate((size.rotatePoint[0] ), (size.rotatePoint[1]));
    this.ctx.scale(size.scale, size.scale)
    this.ctx.rotate(this.objectRender.deg)
    this.ctx.scale(this.objectRender.flipH, this.objectRender.flipV);
    this.ctx.translate((-size.rotatePoint[0] ), (-size.rotatePoint[1]));
    // Then translate the context back.
    this.ctx.drawImage(image, 0, 0, image.width, image.height, size.startPointX, size.startPointY, size.width, size.height);
    this.ctx.restore()
  }

  /* load image */
  loadImage = (item) => new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve({ src: img, type: item.type }));
    img.addEventListener('error', (err) => reject(err));
    img.src = item.src;
    return 1
  });

  drawSingleImg(src) {
    this.clearCanvas()
    let base_image = new Image();
    base_image.onload = () => {
      this.ctx.drawImage(base_image, 0, 0);
    };
    base_image.src = src
    this.ctx.restore()
  }

  drawMultiImg(array) {
    Promise
      .all(array.map(this.loadImage))
      .then((value) => {
        value.forEach((ele, index) => {
          if (ele.type == 'file') {
            this.renderImage(ele.src)
          } else {
            this.ctx.drawImage(ele.src, 0, 0);
          }
        })
      });
    this.ctx.restore()
  }

  draw() {
    let constRender = []
    // case have file
    if (this.objectRender.file) {
      let imgSrc = this.objectRender.manga ? `./images/frame/manga-${this.objectRender.manga}-frame-${this.objectRender.frame}.png` : `./images/frame/frame-${this.objectRender.frame}.png`
      constRender = [
        { src: this.objectRender.file, type: 'file' },
        { src: imgSrc, type: 'img' },
      ]
      this.drawMultiImg(constRender)
    } else {
      // case don't have file
      if (this.objectRender.step1) {
        // case frame message
        if(this.objectRender.frame == this.isMsg) {
          constRender = [
            { src: `./images/frame/manga-${this.objectRender.manga}-frame-${this.objectRender.frame}.png`, type: 'img' },
            { src: './images/frame/frame-6.png', type: 'img' },
          ]
        } else {
          // case frame async
          constRender = [
            { src: `./images/frame/demo-${this.objectRender.frame}.png`, type: 'img' },
            { src: `./images/frame/manga-${this.objectRender.manga}-frame-${this.objectRender.frame}.png`, type: 'img' },
          ]
        }
        this.drawMultiImg(constRender)
      } else {
        // case default
        this.drawSingleImg(`./images/frame/demo-${this.objectRender.frame}.png`)
      }
    }
  }
}

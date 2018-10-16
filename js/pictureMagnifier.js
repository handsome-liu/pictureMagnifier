/**
 * 图片放大 
 * 
 * 用法
 * 
        const picMag = new pictureMagnifier({
            el: '#pictureMagnifier'
        });
        picMag.drag().enable();
 * 
 * HTML模板
 
        <div id="pictureMagnifier">

            <!-- 底层,会有被遮住的效果 -->
            <img class="img-base" src="./images/img.jpg" alt="">

            <!-- 图片展示位置 -->
            <div class="img-show"></div>

            <!-- 根据 clip 来显示局部图片 -->
            <ul class="img-clip">

                <li class="top"></li>

                <li class="right"></li>
                
                <li class="bottom"></li>
                
                <li class="left"></li>
                
                <li class="left-top"></li>
                
                <li class="right-top"></li>
                
                <li class="right-bottom"></li>
                
                <li class="left-bottom"></li>
            
            </ul>

        </div>
 * @param {json} {el:'#id'}
 * @class pictureMagnifier
 */

class pictureMagnifier {
    constructor(obj) {
        // 目标,father
        this.id = document.getElementById(obj.el.slice(1));

        // 获取 clip 文档对象
        this._clip = this.id.getElementsByClassName('img-clip')[0];

        // 获取 show 文档对象
        this._show = this.id.getElementsByClassName('img-show')[0];

        // 阻止默认事件
        this._preventDefault({
            // 拖拽事件
            dragstart: this.id,

            // 右键菜单事件
            contextmenu: this.id,

            // 文本选中事件
            selectstart: this.id
        });
    }

    /**
     * 拖动功能开启和关闭
     * @returns {} enable(),disable()
     * @memberof pictureMagnifier
     */
    drag() {
        const that = this; // 保存 this 指针
        const side = 10; // clip 的最小宽高
        let target, // 保存事件源
            width, // 代理对象的宽高
            height,
            startX, // 鼠标在于浏览器的坐标
            startY,
            clipWidth, // 获取 clip 的宽高
            clipHeight,
            clipTop, // 获取 clip 在父级的的定位值
            clipLeft,
            showWidth, // 获取 show 的宽高
            showHeight,
            isdown = false;

        /**
         * 鼠标按下事件函数
         * 功能是:获取所需的信息
         * 按下后,开启执行移动事件的语句
         */
        const mousedown = function(e) {
            // 保存事件源
            target = e.target;

            // 鼠标在于浏览器的坐标
            startX = e.clientX;
            startY = e.clientY;

            // 代理对象的宽高
            width = that.id.clientWidth;
            height = that.id.clientHeight;

            // 获取 clip 的信息
            clipWidth = that._clip.offsetWidth;
            clipHeight = that._clip.offsetHeight;

            // 获取 clip 在定位父级的位置
            clipLeft = that._clip.offsetLeft;
            clipTop = that._clip.offsetTop;

            // 获取 show 的宽高
            showWidth = that._show.clientWidth;
            showHeight = that._show.clientHeight;

            // 鼠标按下了
            isdown = true;
        };

        /**
         * 鼠标移动事件函数
         * 鼠标点击期间移动才能触发
         * switch 是限制 offX 和 offY 的范围
         */
        const mousemove = function(e) {
            // 鼠标按下了才执行
            if (isdown) {
                // 获取鼠标移动的变化量
                let [offX, offY] = [e.clientX - startX, e.clientY - startY];

                // 获取鼠标当前位置
                let [w, h, l, t] = [clipWidth, clipHeight, clipLeft, clipTop];

                // 根据事件源来判断拖动的效果
                switch (target.className) {
                    case 'top':
                        // console.log('top');

                        // Y 轴方向限制
                        offY = Math.max(offY, -clipTop);
                        offY = Math.min(offY, clipHeight - side);

                        // 设置 height 和 top
                        h = h - offY;
                        t = t + offY;

                        break;

                    case 'right':
                        // console.log('right');

                        // X 轴方向限制
                        offX = Math.max(offX, side - clipWidth);
                        offX = Math.min(offX, width - clipLeft - clipWidth);

                        // 设置 width
                        w = w + offX;

                        break;

                    case 'bottom':
                        // console.log('bottom');

                        // Y 轴方向限制
                        offY = Math.max(offY, side - clipHeight);
                        offY = Math.min(offY, height - clipTop - clipHeight);

                        // 设置 height
                        h = h + offY;

                        break;

                    case 'left':
                        // console.log('left');

                        // X 轴方向限制
                        offX = Math.max(offX, -clipLeft);
                        offX = Math.min(offX, clipWidth - side);

                        // 设置 width 和 left
                        w = w - offX;
                        l = l + offX;

                        break;

                    case 'left-top':
                        // console.log('left-top');

                        // X 轴方向限制
                        offX = Math.max(offX, -clipLeft);
                        offX = Math.min(offX, clipWidth - side);

                        // Y 轴方向限制
                        offY = Math.max(offY, -clipTop);
                        offY = Math.min(offY, clipHeight - side);

                        // 设置 width、height、top 和 left
                        w = w - offX;
                        h = h - offY;
                        l = l + offX;
                        t = t + offY;
                        break;

                    case 'right-top':
                        // console.log('right-top');

                        // X 轴方向限制
                        offX = Math.max(offX, side - clipWidth);
                        offX = Math.min(offX, width - clipLeft - clipWidth);

                        // Y 轴方向限制
                        offY = Math.max(offY, -clipTop);
                        offY = Math.min(offY, clipHeight - side);

                        // 设置 width、height、top
                        w = w + offX;
                        h = h - offY;
                        t = t + offY;
                        break;

                    case 'right-bottom':
                        // console.log('right-bottom');

                        // X 轴方向限制
                        offX = Math.max(offX, side - clipWidth);
                        offX = Math.min(offX, width - clipLeft - clipWidth);

                        // Y 轴方向限制
                        offY = Math.max(offY, side - clipHeight);
                        offY = Math.min(offY, height - clipTop - clipHeight);

                        // 设置 width、height
                        w = w + offX;
                        h = h + offY;
                        break;

                    case 'left-bottom':
                        // console.log('left-bottom');

                        // X 轴方向限制
                        offX = Math.max(offX, -clipLeft);
                        offX = Math.min(offX, clipWidth - side);

                        // Y 轴方向限制
                        offY = Math.max(offY, side - clipHeight);
                        offY = Math.min(offY, height - clipTop - clipHeight);

                        // 设置 width、height 和 left
                        w = w - offX;
                        h = h + offY;
                        l = l + offX;
                        break;

                    case 'img-clip':
                        // console.log('img-clip');

                        // X 轴方向限制
                        offX = Math.max(offX, -clipLeft);
                        offX = Math.min(offX, width - clipLeft - clipWidth);

                        // Y 轴方向限制
                        offY = Math.max(offY, -clipTop);
                        offY = Math.min(offY, height - clipTop - clipHeight);

                        // 设置 width、height 和 left
                        l = l + offX;
                        t = t + offY;

                        break;

                    default:
                        // console.error('你点错地方了!!');
                        break;
                }

                // clip 的 改变
                that._clip.style.width = `${w}px`;
                that._clip.style.height = `${h}px`;
                that._clip.style.left = `${l}px`;
                that._clip.style.top = `${t}px`;

                // clip 的背景图片定位和尺寸改变,
                that._picPosition(that._clip, width, height, l, t);

                // 放大比例值 代理对象的宽度 : clip 的宽度, 必须放在switch后面,w被改变了
                // backgroundSize 由 clipWidth 决定
                // backgroundPosision 由 clipLeft 决定
                const propSizeW = w / width;
                // const propSizeH = h / height;
                const propPosX = l / width;
                const propPosY = t / height;

                const sizeW = showWidth / propSizeW;
                const sizeH = showHeight / propSizeW;
                const posX = sizeW * propPosX;
                const posY = sizeH * propPosY;

                // show 的背景图片定位和尺寸改变
                that._picPosition(that._show, sizeW, sizeH, posX, posY);
            }
        };

        /**
         * 鼠标抬起事件函数
         * 鼠标抬起, 关闭移动事件执行的语句
         */
        const mouseup = function() {
            isdown = false;
        };

        return {
            // 拖动功能开启函数
            enable() {
                document.addEventListener('mousedown', mousedown);
                document.addEventListener('mousemove', mousemove);
                document.addEventListener('mouseup', mouseup);
                return true;
            },

            // 拖动功能关闭函数
            disable() {
                document.removeEventListener('mousedown', mousedown);
                document.removeEventListener('mousemove', mousemove);
                document.removeEventListener('mouseup', mouseup);
                return false;
            }
        };
    }

    /**
     * 背景图定位
     * @param {element} target
     * @param {Number} left
     * @param {Number} top
     * @param {Number} width
     * @param {Number} height
     * @memberof pictureMagnifier
     */
    _picPosition(target, width, height, left, top) {
        target.style.backgroundSize = `${width}px ${height}px`;
        target.style.backgroundPosition = `-${left}px -${top}px`;
    }

    /**
     * 阻止默认事件
     * @param {json} obj 事件类型：被阻止对象
     * @returns {this}
     * @memberof pictureMagnifier
     */
    _preventDefault(obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                obj[key].addEventListener(key, event => event.preventDefault());
            }
        }
        return this;
    }
}

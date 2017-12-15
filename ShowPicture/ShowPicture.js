import React,{Component} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {Cell,CellLabel,CellBody} from '../Cell/index';
import {Button} from '../Button/index';
import { Icon } from 'antd';
import eventProxy from './eventProxy' // 观察者模式
/**
 * 需求：页面中有多个同类组件，但只能显示一个；
 * 同类组件只能显示一个，大多数会使用“子组件->父组件->子组件”通信的模式，但是如果
 * 多处使用，会增加很多冗余的代码，每一处使用到该组件的地方都要做修改，麻烦！！！
 * 
 * 观察模式的好处在于：组件之间的通信，不需要通过父组件，从而减少冗余的代码
 */

import './ShowPicture.css';

export default class ShowPicture extends React.Component{
    static defaultProps={
        model:"default",
        imageUrl:"",
    };
    static propTypes={
        imageUrl:PropTypes.string,
    };
    constructor(props){
        super(props);
        this.imgDeg = 0; // 图片旋转的角度
        this.imgScale = 0.5; // 图片缩放的比例
        this.dragDrop = false; // 图片是否被拖动中
        this.apartX = 0; // 鼠标在图片中与图片左上角的X轴的距离
        this.apartY = 0; //鼠标在图片中与图片左上角的Y轴的距离

        this.state={
            imgStyle:{}, // 设置图片的样式
            imageUrl:this.props.imageUrl,   //图片路径
            previewVisible: false,
            previewImage: '',
        }
    }

    componentDidMount() {
        // 监听者
        eventProxy.on('ShowPicture', (msg) => {
            // 如果图片已经显示，则将其隐藏
            if(this.state.previewVisible){
                this.setState({
                    previewVisible: false,
                    imgStyle:{display:'none'}
                });
            }
        });
    }

    // 图片显示与隐藏
    handlePreview = () => {
        if(this.state.previewVisible){
            this.setState({
                previewVisible:false,
                imgStyle:{transform:`rotate(${this.imgDeg}deg) scale(${this.imgScale})`,display:'none'}
            });
        }else{
            // 发布者
            eventProxy.trigger('ShowPicture', 'open');

            this.setState({
                previewImage: this.props.imageUrl,
                previewVisible: true,
                imgStyle:{transform:`rotate(${this.imgDeg}deg) scale(${this.imgScale})`,display:'inline-block'}
            },()=>{
                // 初始化图片开始的位置
                const imgWrap = this.refs.showPreviewImageWrap;
                let srn_w = document.body.offsetWidth/2;
                let srn_h = document.body.offsetHeight/2;
                // 获取图片的宽高，之所以在这里获取，是因为必须等previewVisible等于true时（即图片已经显示的时候）,才能获取得到
                let img_w = imgWrap.offsetWidth/2;
                let img_h = imgWrap.offsetHeight/2;
                imgWrap.style.left = srn_w - img_w + 'px';
                imgWrap.style.top = srn_h - img_h + 'px';
            });
        }
    }
    // 图像滚轮事件
    MousewheelRotateImg = (event) =>{
        if(event.deltaY > 0){
            this.imgScale = this.imgScale - 0.2;
        }else{
            this.imgScale = this.imgScale + 0.2;
        }
        if(this.imgScale < 0.2){
            this.imgScale = 0.2
        }
        this.setState({
            imgStyle:{transform:`rotate(${this.imgDeg}deg) scale(${this.imgScale})`}
        });
        event.stopPropagation();
        event.preventDefault();
    }
    // 放大图像
    plusRotateImg = () => {
        this.imgScale = this.imgScale + 0.2;
        this.setState({
            imgStyle:{transform:`rotate(${this.imgDeg}deg) scale(${this.imgScale})`}
        });
    }
    // 缩小图像
    minusRotateImg = () => {
        this.imgScale = this.imgScale - 0.2;
        if(this.imgScale < 0.2){
            this.imgScale = 0.2
        }
        this.setState({
            imgStyle:{transform:`rotate(${this.imgDeg}deg) scale(${this.imgScale})`}
        });
    }
    // 逆时针旋转
    leftToRotateImg = () => {
        this.imgDeg = this.imgDeg - 90;
        if(this.imgDeg < -360){
            this.imgDeg = -90;
        }
        this.setState({
            imgStyle:{transform:`rotate(${this.imgDeg}deg) scale(${this.imgScale})`}
        });
    }
    // 顺时针旋转
    rightToRotateImg = () => {
        this.imgDeg = this.imgDeg + 90;
        if(this.imgDeg > 360){
            this.imgDeg = 90;
        }
        this.setState({
            imgStyle:{transform:`rotate(${this.imgDeg}deg) scale(${this.imgScale})`}
        });
    }
    _mouseDown = (event) => {
        this.dragDrop = true;
        const imgWrap = this.refs.showPreviewImageWrap;
        this.apartX = event.pageX - imgWrap.offsetLeft;// 鼠标在图片中与图片左上角的X轴的距离
        this.apartY = event.pageY - imgWrap.offsetTop;

        event.preventDefault();
        event.stopPropagation();
    }
    _mouseUp = (event) => {
        this.dragDrop = false;

        event.preventDefault();
        event.stopPropagation();
    }
    // 图片跟随鼠标移动
    _mouseMove = (event) => {
        if (!this.dragDrop) {
            return;
        }

        const imgWrap = this.refs.showPreviewImageWrap;
        imgWrap.style.left = (event.pageX - this.apartX)+ 'px';
        imgWrap.style.top = (event.pageY - this.apartY) + 'px';


        event.preventDefault();
        event.stopPropagation();
    }

    render(){
        const {className,width,model,imageUrl,children,...others}=this.props;
        const clswrap=classNames({
            "hs_show":true,
            [className]:className
        });
        const clsparper=classNames({
            "hs_show-img-wrap":true,
            "hs_paper_img1":model==='business',
            "hs_paper_img2":model==='IDcardFront',
            "hs_paper_img3":model==='IDcardReverse',
            "hs_paper_img4":model==='shop',
            "hs_paper_img5":model==='default',
            [className]:className
        });
        const clsimgwrap=classNames({
            "hs_show-img-wrap":true,
            [className]:className
        });
        let styleWidth={
            width:width+'px'
        }
        const { previewVisible, previewImage } = this.state;
        return(
            <div className={clswrap} {...others} style={styleWidth}>
                <div className={clsparper}>
                    {imageUrl ? <img src={imageUrl} onClick={this.handlePreview} alt="" className={clsimgwrap} style={{cursor:'pointer'}}/> :''}
                </div>
                <span>{children}</span>

                <img ref="showPreviewImageWrap" 
                    onWheel={this.MousewheelRotateImg.bind(this)} 
                    onMouseUp={this._mouseUp.bind(this)} 
                    onMouseDown={this._mouseDown.bind(this)} 
                    onMouseMove={this._mouseMove.bind(this)} 
                    className="show_picture_image_wrap show_picture_image" 
                    style={this.state.imgStyle} 
                    src={previewImage} />

                <div className="show_picture_operationBtn" style={{display:previewVisible?'block':'none',position: 'fixed',zIndex: '1001'}}>
                    <Icon type="plus-circle-o" onClick={this.plusRotateImg}/>
                    <Icon type="minus-circle-o" onClick={this.minusRotateImg}/>
                    <Icon type="reload" onClick={this.leftToRotateImg} style={{transform:'scaleX(-1)'}}/>
                    <Icon type="reload" onClick={this.rightToRotateImg}/>
                    <Icon type="close-circle-o" onClick={this.handlePreview}/>
                </div>
            </div>
        )
    }
}

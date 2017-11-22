import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import './ShowPicture.css';

export default class ShowPicture extends React.Component{
    static defaultProps={
        model:"default",
        imageUrl:""
    };
    static propTypes={
        imageUrl:PropTypes.string,
    };
    constructor(props){
        super(props);
        this.imgDeg = 0; // 图片旋转的角度
        this.imgScale = 1; // 图片缩放的比例
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

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = () => {
        if(this.state.previewVisible){
            this.setState({
                previewVisible:false
            });
        }else{
            this.setState({
                previewImage: this.props.imageUrl,
                previewVisible: true,
            });
        }
    }
    // 图像滚轮事件
    MousewheelRotateImg = (event) =>{
        if(event.deltaY > 0){
            this.imgScale = this.imgScale + 0.5;
        }else{
            this.imgScale = this.imgScale - 0.5;
        }
        if(this.imgScale < 0.5){
            this.imgScale = 0.5
        }
        this.setState({
            imgStyle:{transform:`rotate(${this.imgDeg}deg) scale(${this.imgScale})`}
        });
        event.stopPropagation();
        event.preventDefault();
    }
    // 放大图像
    plusRotateImg = () => {
        this.imgScale = this.imgScale + 0.5;
        this.setState({
            imgStyle:{transform:`rotate(${this.imgDeg}deg) scale(${this.imgScale})`}
        });
    }
    // 缩小图像
    minusRotateImg = () => {
        this.imgScale = this.imgScale - 0.5;
        if(this.imgScale < 0.5){
            this.imgScale = 0.5
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
        // 是否显示使用默认的几种图片
        const clsparper=classNames({
            "hs_show-img-wrap":true,
            "hs_paper_img01":model==='business',
            "hs_paper_img02":model==='IDcardFront',
            "hs_paper_img03":model==='IDcardReverse',
            "hs_paper_img04":model==='shop',
            "hs_paper_img05":model==='default',
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
                
                <div className="show_picture_image_wrap" ref="showPreviewImageWrap" style={{display:previewVisible?'inline-block':'none'}}>
                    <img onWheel={this.MousewheelRotateImg.bind(this)} onMouseUp={this._mouseUp.bind(this)} onMouseDown={this._mouseDown.bind(this)} onMouseMove={this._mouseMove.bind(this)} className="show_picture_image" style={this.state.imgStyle} src={previewImage} />
                </div>
                <div className="show_picture_operationBtn" style={{display:previewVisible?'block':'none',position: 'fixed',zIndex: '1001'}}>
                    <Icon type="plus-circle-o" onClick={this.plusRotateImg}/>
                    <Icon type="minus-circle-o" onClick={this.minusRotateImg}/>
                    <Icon type="reload" onClick={this.leftToRotateImg} style={{transform:'scaleX(-1)'}}/>
                    <Icon type="reload" onClick={this.rightToRotateImg}/>
                    <Icon type="close-circle-o" onClick={this.handleCancel}/>
                </div>
            </div>
        )
    }
}

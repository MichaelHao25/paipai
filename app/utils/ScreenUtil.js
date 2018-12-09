/**
 * 饶小梅
 * 12-6
 * 屏幕工具类
 * ui设计基准,iphone 6 2倍图
 * width:750px
 * @2x
 */
import {
    PixelRatio,
    Dimensions,
} from 'react-native';


//字体适配，默认的设计图的宽度是750
const i_designWidth = 500;
//设置设计稿的宽度
//使用iPhone6作为参考375的宽度像素密度为2
// 则375*2=750

const i_screenW = Dimensions.get('window').width;
//获取设备的尺寸

const f_fontScale = PixelRatio.getFontScale();
//获取文字的缩放比例，系统设置的字体大小
//单位0.7-1.3之间

const i_pixelRatio = PixelRatio.get();
//获取像素密度
//比如iPhone6 375的尺寸，像素密度是2
//此变量没有用到


/**
 * 屏幕适配,缩放size , 默认根据宽度适配
 * 如：width ,paddingHorizontal ,paddingLeft ,paddingRight ,marginHorizontal ,marginLeft ,marginRight
 * @param size 设计图的尺寸
 * @returns {number}
 */
export function SW(width) {

    let f_scalingRatio = width/i_designWidth
    //得到缩放比例
    
    let f_resuit = i_screenW*f_scalingRatio
    //得到最终结果

    return f_resuit;
}
/**
 * 屏幕适配,缩放size , 默认根据宽度适配
 * 如：width ,paddingHorizontal ,paddingLeft ,paddingRight ,marginHorizontal ,marginLeft ,marginRight
 * @param size 设计图的尺寸
 * @returns {number}
 */
export function SH(width) {

    let f_scalingRatio = width/i_designWidth
    //得到缩放比例
    
    let f_resuit = i_screenW*f_scalingRatio
    //得到最终结果

    return f_resuit;
}


/**
 * 设置字体的size（单位px）
 * @param size 传入设计稿上的px , allowFontScaling 是否根据设备文字缩放比例调整，默认不会
 * @returns {Number} 返回实际sp
 */
export function FZ(size) {
    
    
    let f_scalingRatio = size/i_designWidth
    //得到缩放比例
    
    let f_resuit = i_screenW*f_scalingRatio
    //得到最终结果

    f_resuit=f_resuit/f_fontScale
    //不让系统的缩放生效，系统放大则减小，系统缩小则放大字体。

    return f_resuit;
}

import { useEffect, useState } from 'react';
import videoSource from './assets/mov_bbb.mp4'; // 添加此行

interface DetectionResult {
  time: string;
  flames: number;
  positions: {
    left: number; top: number; width: number; height: number;
  };
}

function App() {
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([]);
  const [currentFrame, setCurrentFrame] = useState<string>('');
  console.log("currentFrame: ", currentFrame);
  

  useEffect(() => {
    setDetectionResults([
      { time: '00:00:02', flames: 3, positions: {left: 90, top: 0, width: 150, height: 150} },
      { time: '00:00:08', flames: 1, positions: {left: 20, top: 10, width: 30, height: 40}  },
    ]);
  }, []);

  return (
    <div className="h-screen flex flex-col p-4 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 text-center mx-auto mb-4">火情识别系统</h1>

      <div className="flex-1 flex flex-col space-y-4">
        {/* 第一行 */}
        <div className="flex-1 max-h-[40vh]] grid grid-cols-12 gap-4">
          {/* 视频区域 */}
          <div className="col-span-4 bg-gray-100 rounded-lg">
            <video src={videoSource} controls className="object-cover rounded-md h-full " />
          </div>

          {/* 识别结果 */}
          <div className="col-span-4 bg-white shadow rounded-lg p-4 overflow-auto">
            <h2 className="text-lg font-semibold mb-3">识别结果</h2>
            <ul className="space-y-2">
              {detectionResults.map((result, index) => (
                <li key={index} className="text-sm p-2 bg-blue-50 rounded cursor-pointer"
                  onClick={() => {
                    const video = document.querySelector('video') as HTMLVideoElement;
                    if (video) {
                      // 将时间字符串转换为秒数
                      const timeStr = result.time; // 格式: "00:01:23"
                      const [hours, minutes, seconds] = timeStr.split(':').map(Number);
                      const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
                      
                      // 设置视频时间点
                      video.currentTime = timeInSeconds;
                      
                      // 在视频跳转到指定时间后截取帧并标注位置
                      const captureFrame = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          // 绘制视频帧
                          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                          
                          // 绘制红色边框标注火焰位置
                          ctx.strokeStyle = 'red';
                          ctx.lineWidth = 2;
                          const { left, top, width, height } = result.positions;
                          
                          // 绘制红色边框（直接使用positions中的坐标值）
                          ctx.strokeRect(left, top, width, height);
                          
                          // 转换为图片URL
                          setCurrentFrame(canvas.toDataURL('image/png'));
                        }
                      };
                      
                      // 监听视频的seeked事件，确保视频已经跳转到指定时间
                      const handleSeeked = () => {
                        captureFrame();
                        video.removeEventListener('seeked', handleSeeked);
                      };
                      
                      video.addEventListener('seeked', handleSeeked);
                    }
                  }}
                >
                  <div>时间: {result.time}</div>
                  <div>数量: {result.flames}</div>
                  <div>位置: {JSON.stringify(result.positions)}</div>  
                </li>
              ))}
            </ul>
          </div>

          {/* 检测结果 */}
          <div className="col-span-4 bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">检测结果</h2>
            <div className="text-sm text-gray-600">
              当前帧检测状态：正常<br />
              平均处理速度：30ms/帧
            </div>
          </div>
        </div>

        {/* 第二行 */}
        <div className="flex-1 grid grid-cols-12 gap-4 max-h-[40vh]">
          <div className="col-span-4 bg-white shadow rounded-lg p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-3">ROI设置</h2>
            <div className="flex-1 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
              {currentFrame ? (
                <img src={currentFrame} alt="当前帧" className="object-contain" />
              ) : (
                '区域选择画布'
              )}
            </div>
          </div>

          <div className="col-span-8 bg-white shadow rounded-lg p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-3">ROI分析</h2>
            <div className="flex-1 text-sm space-y-2">
              <div className="flex justify-between">
                <span>敏感区域数量:</span>
                <span>3个</span>
              </div>
              <div className="flex justify-between">
                <span>最后更新时间:</span>
                <span>15:23:45</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

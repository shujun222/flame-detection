import { useEffect, useState } from 'react';

interface DetectionResult {
  time: string;
  flames: number;
  positions: string[];
}

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([]);

  useEffect(() => {
    setVideoUrl('path/to/video.mp4');
    setDetectionResults([
      { time: '00:01:23', flames: 3, positions: ['top-left', 'center', 'bottom-right'] },
      { time: '00:02:45', flames: 1, positions: ['center'] },
    ]);
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">火焰识别系统</h1>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* 视频区域 */}
        <div className="col-span-2 bg-gray-100 rounded-lg p-4">
          <video src={videoUrl} controls className="w-full aspect-video rounded-md" />
        </div>

        {/* 识别结果 */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">识别结果</h2>
          <ul className="space-y-2">
            {detectionResults.map((result, index) => (
              <li key={index} className="text-sm p-2 bg-blue-50 rounded">
                <div>时间: {result.time}</div>
                <div>数量: {result.flames}</div>
                <div>位置: {result.positions.join(', ')}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* 检测结果 */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">检测结果</h2>
          <div className="text-sm text-gray-600">
            当前帧检测状态：正常<br />
            平均处理速度：30ms/帧
          </div>
        </div>
      </div>

      {/* ROI区域 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">ROI设置</h2>
          <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
            区域选择画布
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">ROI分析</h2>
          <div className="text-sm space-y-2">
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
  );
}

export default App;

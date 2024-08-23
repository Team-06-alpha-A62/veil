import { useState, ChangeEvent, DragEvent } from 'react';

interface DragZoneProps {
  handleFileChange: (file: File) => void;
  width?: number;
  height?: number;
  round?: boolean;
  imageUrl?: string;
}

const DragZone: React.FC<DragZoneProps> = ({
  handleFileChange,
  width = 100,
  height = 100,
  round = false,
  imageUrl = '',
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];

    if (file) {
      handleFileChange(file);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  return (
    <div
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`relative flex items-center justify-center border-2 border-dashed ${
        isDragging ? 'border-purple-500' : 'border-gray-300'
      } ${round ? 'rounded-full' : 'rounded-lg'} cursor-pointer`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        name="image"
        id="image"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />
      <label
        htmlFor="image"
        className={`absolute inset-0 flex items-center justify-center ${
          isDragging ? 'bg-purple-100 bg-opacity-30' : ''
        } ${round ? 'rounded-full' : 'rounded-lg'}`}
      >
        {imageUrl ? (
          <div
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: `${round ? '50%' : '10px'}`,
            }}
            className="w-full h-full"
            alt="Image Preview"
          ></div>
        ) : (
          <span className="text-gray-600">
            {round ? '+' : 'Drag & drop | Click to choose file'}
          </span>
        )}
      </label>
    </div>
  );
};

export default DragZone;

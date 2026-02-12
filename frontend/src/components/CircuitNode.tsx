import Image from 'next/image';
import { motion } from 'framer-motion';

interface CircuitNodeProps {
  id: string;
  type: 'model' | 'tool' | 'memory' | 'process';
  name: string;
  position: { x: number; y: number };
  selected?: boolean;
  onDragStart: (nodeId: string) => void;
  onDragEnd: (nodeId: string, position: { x: number; y: number }) => void;
  onClick: (nodeId: string) => void;
}

const nodeIcons = {
  model: '/icons/model.svg',
  tool: '/icons/tool.svg',
  memory: '/icons/memory.svg',
  process: '/icons/process.svg'
};

export function CircuitNode({
  id,
  type,
  name,
  position,
  selected,
  onDragStart,
  onDragEnd,
  onClick
}: CircuitNodeProps) {
  return (
    <motion.div
      className={`circuit-node ${type} ${selected ? 'selected' : ''}`}
      initial={position}
      animate={position}
      drag
      dragMomentum={false}
      onDragStart={() => onDragStart(id)}
      onDragEnd={(_, info) => onDragEnd(id, { x: info.point.x, y: info.point.y })}
      onClick={() => onClick(id)}
    >
      <div className="node-icon">
        <Image
          src={nodeIcons[type]}
          alt={type}
          width={24}
          height={24}
          priority
        />
      </div>
      <h3 className="node-name">{name}</h3>
    </motion.div>
  );
}
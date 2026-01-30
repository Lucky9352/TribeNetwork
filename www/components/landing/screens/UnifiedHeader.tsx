import React from 'react'

export const UnifiedHeader = () => (
  <div className="h-14 border-b border-white/5 flex items-center justify-between px-5 bg-black/80 backdrop-blur-md z-40 absolute top-0 left-0 right-0 shrink-0">
    <h1 className="text-xl font-bold text-blue-400 mt-1">Tribe</h1>
    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-white/20 flex items-center justify-center">
      <span className="text-[10px] font-bold text-blue-300">TN</span>
    </div>
  </div>
)

import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { CreationJob, CreationJobStatus } from '../types';
import { PhotoIcon, VideoCameraIcon, ClockIcon, CheckCircleIcon, XCircleIcon, PencilSquareIcon, RectangleStackIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const StatusBadge: React.FC<{ status: CreationJobStatus }> = ({ status }) => {
    const statusStyles = {
        Pending: { icon: <ClockIcon className="w-3 h-3" />, color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
        Generating: { icon: <div className="w-3 h-3 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent"></div>, color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
        Completed: { icon: <CheckCircleIcon className="w-3 h-3" />, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
        Failed: { icon: <XCircleIcon className="w-3 h-3" />, color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    };
    const { icon, color } = statusStyles[status] || statusStyles.Pending;

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${color}`}>
            {icon}
            {status}
        </div>
    );
};

const JobCard: React.FC<{ job: CreationJob, onView: (job: CreationJob) => void }> = ({ job, onView }) => {
    const jobTypeIcons = {
        UGC_VIDEO: <VideoCameraIcon className="w-6 h-6 text-zinc-500" />,
        PROMO_VIDEO: <VideoCameraIcon className="w-6 h-6 text-zinc-500" />,
        IMAGE: <PhotoIcon className="w-6 h-6 text-zinc-500" />,
        CONTENT: <PencilSquareIcon className="w-6 h-6 text-zinc-500" />,
    };

    return (
        <div className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-white/5 hover:border-white/10 transition-all duration-200 h-full flex flex-col">
            {/* Image/Preview Area */}
            <div className="aspect-video bg-black flex items-center justify-center overflow-hidden relative">
                {job.status === 'Completed' ? (
                    job.resultUrl ? (
                        job.type.includes('VIDEO') ? (
                            <video src={job.resultUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                            <img src={job.resultUrl} alt={job.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                        )
                    ) : job.resultText ? (
                        <div className="p-6 text-left w-full h-full bg-zinc-900 overflow-hidden">
                             <div className="prose prose-invert prose-xs line-clamp-6 opacity-60 font-mono text-[10px]">
                                {job.resultText}
                            </div>
                        </div>
                    ) : (
                        <div className="text-zinc-700">{jobTypeIcons[job.type]}</div>
                    )
                ) : (
                    <div className="flex flex-col items-center gap-2">
                         {jobTypeIcons[job.type]}
                         {job.status === 'Generating' && <span className="text-[10px] text-indigo-400 animate-pulse font-medium tracking-widest">PROCESSING</span>}
                    </div>
                )}
                
                {/* Hover Overlay */}
                {job.status === 'Completed' && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onView(job); }}
                            className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform pointer-events-auto"
                        >
                            <EyeIcon className="w-4 h-4" />
                            View
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-4 flex flex-col flex-grow relative border-t border-white/5">
                <div className="flex justify-between items-start mb-2">
                    <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                        {job.type.replace('_', ' ')}
                    </div>
                    <p className="text-[10px] text-zinc-600 font-mono">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
                
                <h3 className="font-medium text-zinc-200 truncate mb-4 text-sm" title={job.title}>{job.title}</h3>
                
                <div className="flex justify-between items-center pt-2 mt-auto">
                    <StatusBadge status={job.status} />
                </div>
            </div>
        </div>
    );
};

const CreationsHub: React.FC = () => {
  const { creations, t } = useAppContext();
  const [viewingJob, setViewingJob] = useState<CreationJob | null>(null);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-bold font-display text-white">{t('creations_hub')}</h1>
            <p className="text-zinc-400 mt-1">Asset library.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {creations.length} Assets
          </div>
      </div>

      {creations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creations.map(job => <JobCard key={job.id} job={job} onView={setViewingJob} />)}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <RectangleStackIcon className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">Library Empty</h3>
            <p className="text-zinc-500 max-w-xs mb-6 text-sm">Generated assets will appear here.</p>
        </div>
      )}

      {/* Asset Viewer Modal */}
      <Modal isOpen={!!viewingJob} onClose={() => setViewingJob(null)} title={viewingJob?.title || 'Asset Viewer'}>
          <div className="space-y-6">
              <div className="bg-black rounded-lg overflow-hidden border border-white/10 flex items-center justify-center min-h-[200px] max-h-[60vh]">
                  {viewingJob?.type.includes('VIDEO') ? (
                       <video src={viewingJob.resultUrl} controls autoPlay className="w-full h-full max-h-[60vh] object-contain" />
                  ) : viewingJob?.type === 'IMAGE' ? (
                       <img src={viewingJob.resultUrl} alt={viewingJob.title} className="w-full h-full max-h-[60vh] object-contain" />
                  ) : (
                       <div className="p-6 w-full h-full overflow-y-auto max-h-[60vh]">
                           <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed">
                               {viewingJob?.resultText}
                           </pre>
                       </div>
                  )}
              </div>
              
              <div className="flex items-center justify-between">
                  <div className="text-xs text-zinc-500">
                      <span className="block font-medium text-zinc-300 mb-1">Details</span>
                      <span>Created: {viewingJob && new Date(viewingJob.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-3">
                      {viewingJob?.resultUrl && (
                          <a href={viewingJob.resultUrl} download={`${viewingJob.title.substring(0,20).replace(/\s+/g, '_')}.${viewingJob.type.includes('VIDEO') ? 'mp4' : 'png'}`} target="_blank" rel="noreferrer">
                              <Button variant="secondary" leftIcon={<ArrowDownTrayIcon className="w-4 h-4"/>}>Download</Button>
                          </a>
                      )}
                      <Button onClick={() => setViewingJob(null)}>Close</Button>
                  </div>
              </div>
          </div>
      </Modal>
    </div>
  );
};

export default CreationsHub;
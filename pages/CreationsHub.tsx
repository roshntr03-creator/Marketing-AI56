import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { CreationJob, CreationJobStatus } from '../types';
import { PhotoIcon, VideoCameraIcon, ClockIcon, CheckCircleIcon, XCircleIcon, PencilSquareIcon, RectangleStackIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const StatusBadge: React.FC<{ status: CreationJobStatus }> = ({ status }) => {
    const statusStyles = {
        Pending: { icon: <ClockIcon className="w-3 h-3" />, color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
        Generating: { icon: <div className="w-3 h-3 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
        Completed: { icon: <CheckCircleIcon className="w-3 h-3" />, color: 'bg-green-500/10 text-green-400 border-green-500/20' },
        Failed: { icon: <XCircleIcon className="w-3 h-3" />, color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    };
    const { icon, color } = statusStyles[status] || statusStyles.Pending;

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color} backdrop-blur-sm shadow-sm`}>
            {icon}
            {status}
        </div>
    );
};

const JobCard: React.FC<{ job: CreationJob, onView: (job: CreationJob) => void }> = ({ job, onView }) => {
    const jobTypeIcons = {
        UGC_VIDEO: <VideoCameraIcon className="w-8 h-8 text-text-muted" />,
        PROMO_VIDEO: <VideoCameraIcon className="w-8 h-8 text-text-muted" />,
        IMAGE: <PhotoIcon className="w-8 h-8 text-text-muted" />,
        CONTENT: <PencilSquareIcon className="w-8 h-8 text-text-muted" />,
    };

    return (
        <div className="group relative rounded-2xl overflow-hidden bg-background-card border border-surface-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] hover:-translate-y-1 h-full flex flex-col">
            {/* Image/Preview Area */}
            <div className="aspect-video bg-background-dark/50 flex items-center justify-center overflow-hidden relative">
                {job.status === 'Completed' ? (
                    job.resultUrl ? (
                        job.type.includes('VIDEO') ? (
                            <video src={job.resultUrl} className="w-full h-full object-cover" />
                        ) : (
                            <img src={job.resultUrl} alt={job.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        )
                    ) : job.resultText ? (
                        <div className="p-6 text-left w-full h-full bg-white/5 backdrop-blur-sm overflow-hidden">
                             <div className="prose prose-invert prose-xs line-clamp-6 opacity-80 font-mono text-xs">
                                {job.resultText}
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500">{jobTypeIcons[job.type]}</div>
                    )
                ) : (
                    <div className="flex flex-col items-center gap-2">
                         {jobTypeIcons[job.type]}
                         {job.status === 'Generating' && <span className="text-xs text-primary animate-pulse tracking-wider font-bold">GENERATING...</span>}
                    </div>
                )}
                
                {/* Hover Overlay */}
                {job.status === 'Completed' && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onView(job); }}
                            className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform pointer-events-auto shadow-lg cursor-pointer"
                        >
                            <EyeIcon className="w-4 h-4" />
                            View Asset
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-grow relative">
                <div className="flex justify-between items-start mb-3">
                    <div className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-bold uppercase tracking-wider text-text-secondary border border-white/5">
                        {job.type.replace('_', ' ')}
                    </div>
                    <p className="text-[10px] text-text-muted font-mono">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
                
                <h3 className="font-bold text-white truncate mb-4 group-hover:text-primary transition-colors text-sm" title={job.title}>{job.title}</h3>
                
                <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-auto">
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
            <p className="text-text-secondary mt-1">Manage your asset library and generation history.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-text-secondary bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {creations.length} Assets Stored
          </div>
      </div>

      {creations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creations.map(job => <JobCard key={job.id} job={job} onView={setViewingJob} />)}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-surface-border rounded-3xl bg-white/5 hover:bg-white/10 transition-colors cursor-default">
            <div className="w-24 h-24 bg-background-dark rounded-full flex items-center justify-center mb-6 border border-surface-border shadow-xl">
                <RectangleStackIcon className="w-10 h-10 text-text-muted" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 font-display">Library Empty</h3>
            <p className="text-text-secondary max-w-md mb-8">Your generated videos, images, and copy will appear here once you start creating.</p>
        </div>
      )}

      {/* Asset Viewer Modal */}
      <Modal isOpen={!!viewingJob} onClose={() => setViewingJob(null)} title={viewingJob?.title || 'Asset Viewer'}>
          <div className="space-y-6">
              <div className="bg-black/40 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center min-h-[200px] max-h-[60vh]">
                  {viewingJob?.type.includes('VIDEO') ? (
                       <video src={viewingJob.resultUrl} controls autoPlay className="w-full h-full max-h-[60vh] object-contain" />
                  ) : viewingJob?.type === 'IMAGE' ? (
                       <img src={viewingJob.resultUrl} alt={viewingJob.title} className="w-full h-full max-h-[60vh] object-contain" />
                  ) : (
                       <div className="p-6 w-full h-full overflow-y-auto max-h-[60vh]">
                           <pre className="whitespace-pre-wrap font-sans text-sm text-text-primary leading-relaxed">
                               {viewingJob?.resultText}
                           </pre>
                       </div>
                  )}
              </div>
              
              <div className="flex items-center justify-between">
                  <div className="text-xs text-text-secondary">
                      <span className="block font-bold text-white mb-1">Details</span>
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
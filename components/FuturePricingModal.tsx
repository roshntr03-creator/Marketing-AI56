import React from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface FuturePricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContactClick: () => void;
}

const FuturePricingModal: React.FC<FuturePricingModalProps> = ({ isOpen, onClose, onContactClick }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upcoming Plans">
            <div className="space-y-4 text-center">
                <h3 className="text-xl font-bold text-text-primary">Advanced Tiers are Coming Soon!</h3>
                <p className="text-text-secondary">
                    We're actively developing powerful new plans designed for larger teams and enterprises. 
                    Expect features like advanced collaboration tools, API access for custom integrations, and dedicated account management.
                </p>
                <p className="text-text-secondary font-semibold">
                    Interested in early access or have specific requirements?
                </p>
                <Button onClick={onContactClick} className="w-full !py-3">
                    Contact Sales
                </Button>
            </div>
        </Modal>
    );
};

export default FuturePricingModal;
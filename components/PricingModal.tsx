import React from 'react';
import { Link } from 'react-router-dom';
import Modal from './ui/Modal';
import Card from './ui/Card';
import Button from './ui/Button';
import { PRICING_PLANS } from '../constants';
import { CheckIcon } from '@heroicons/react/24/solid';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Simple, Transparent Pricing">
            <div className="space-y-4">
                <p className="text-sm text-center text-text-secondary pb-2">Choose the plan that's right for your business. No hidden fees.</p>
                <div className="space-y-4">
                    {PRICING_PLANS.map((plan) => (
                        <Card key={plan.name} className={`p-6 text-left ${plan.isPopular ? 'border-2 border-primary' : ''}`}>
                            {plan.isPopular && <div className="text-primary bg-primary/20 text-xs font-bold inline-block px-3 py-1 rounded-full mb-4">MOST POPULAR</div>}
                            <h3 className="text-xl font-bold">{plan.name}</h3>
                            <p className="text-text-secondary my-2 text-sm">{plan.description}</p>
                            <div className="my-4">
                                <span className="text-3xl font-bold">{plan.price}</span>
                                <span className="text-text-secondary">{plan.frequency}</span>
                            </div>
                            <Link to="/signup">
                                <Button className="w-full !py-2.5" variant={plan.isPopular ? 'primary' : 'secondary'}>Get Started</Button>
                            </Link>
                            <ul className="space-y-2 mt-6 text-sm">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckIcon className="w-5 h-5 text-green-500" />
                                        <span className="text-text-secondary">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            </div>
        </Modal>
    );
};

export default PricingModal;

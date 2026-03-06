'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle,
  Phone,
  Mail,
  Building,
  Calculator,
} from 'lucide-react';
import { toast } from 'sonner';

export function PlanSubmissionSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectDesc: '',
    preferredContact: 'email',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Invalid file type. Please upload PDF, JPG, or PNG files.');
        return;
      }

      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit.');
        return;
      }

      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('company', formData.company);
      submitData.append('projectDesc', formData.projectDesc);
      submitData.append('preferredContact', formData.preferredContact);
      if (file) {
        submitData.append('file', file);
      }

      const response = await fetch('/api/plans', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Plan submitted successfully! We will review and get back to you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          projectDesc: '',
          preferredContact: 'email',
        });
        setFile(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit plan. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToCalculator = () => {
    const element = document.querySelector('#calculator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-[#1E3A5F]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-[#F97316]/20 text-[#F97316] mb-4">
            Plan Submission
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Submit Your Plans for Material Estimation
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Upload your construction drawings or plans, and our team will provide a
            detailed material quantity survey and quote for your project.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Features */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F97316] rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Professional Quantity Survey
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Our experienced team will analyze your plans and provide a
                      comprehensive material list with accurate quantities for your
                      project.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F97316] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Detailed Cost Estimate
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Receive a detailed quote including block quantities,
                      delivery costs, and any additional materials needed for your
                      project.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F97316] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Expert Consultation
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Get free expert advice on material selection, construction
                      techniques, and project planning from our team with 20+ years
                      of experience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="font-semibold text-white mb-3">Supported File Types</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-white/30 text-white">
                  <FileText className="h-3 w-3 mr-1" />
                  PDF
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  <ImageIcon className="h-3 w-3 mr-1" />
                  JPG
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  <ImageIcon className="h-3 w-3 mr-1" />
                  PNG
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  DWG
                </Badge>
              </div>
              <p className="text-gray-400 text-sm mt-3">
                Maximum file size: 10MB
              </p>
            </div>
          </div>

          {/* Form */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-[#F97316] text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Submit Your Plans
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1E3A5F] mb-2">
                    Plan Submitted Successfully!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Our team will review your plans and contact you within 24-48
                    hours with a detailed material estimate.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="border-[#F97316] text-[#F97316]"
                    >
                      Submit Another Plan
                    </Button>
                    <Button
                      onClick={scrollToCalculator}
                      className="bg-[#1E3A5F] hover:bg-[#152d4a]"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Try Calculator
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="plan-name">Full Name *</Label>
                      <Input
                        id="plan-name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="plan-phone">Phone Number *</Label>
                      <Input
                        id="plan-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+592 XXX-XXXX"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="plan-email">Email Address *</Label>
                    <Input
                      id="plan-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="plan-company">Company (Optional)</Label>
                    <Input
                      id="plan-company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your company name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="plan-desc">Project Description *</Label>
                    <Textarea
                      id="plan-desc"
                      name="projectDesc"
                      value={formData.projectDesc}
                      onChange={handleInputChange}
                      placeholder="Describe your project, including dimensions, timeline, and any specific requirements..."
                      required
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="plan-contact">Preferred Contact Method</Label>
                    <Select
                      value={formData.preferredContact}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, preferredContact: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </div>
                        </SelectItem>
                        <SelectItem value="phone">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone Call
                          </div>
                        </SelectItem>
                        <SelectItem value="whatsapp">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            WhatsApp
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* File Upload */}
                  <div>
                    <Label>Upload Plans/Drawing</Label>
                    <div className="mt-1">
                      {file ? (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <div className="flex items-center gap-3">
                            {file.type.includes('image') ? (
                              <ImageIcon className="h-8 w-8 text-blue-500" />
                            ) : (
                              <FileText className="h-8 w-8 text-red-500" />
                            )}
                            <div>
                              <p className="font-medium text-sm">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={removeFile}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400">
                            PDF, JPG, PNG (max 10MB)
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#F97316] hover:bg-orange-600 h-12"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit for Quantity Survey
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

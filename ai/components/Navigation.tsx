'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Book,
  GraduationCap,
  Home,
  Briefcase,
  Search,
  PartyPopper,
  Heart,
  Settings,
  Menu,
  X,
  ChevronDown,
  Calendar,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock,
  BarChart,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

/**
 * @file Navigation.tsx
 * @description Main navigation component with collapsible sidebars, timetable,
 * and attendance tracking. Supports both mobile and desktop layouts.
 */

/** Navigation category configuration */
interface NavigationCategory {
  title: string
  icon: React.ElementType
  items: string[]
}

/** Schedule slot configuration */
interface ScheduleSlot {
  time: string
  subject: string
  room: string
}

/** Attendance data configuration */
interface AttendanceRecord {
  subject: string
  percentage: number
  classes: string
}

/** Available days for timetable */
type TimetableDay = 'Monday' | 'Tuesday' | 'Wednesday'

/** Timetable data structure */
type TimetableData = Record<TimetableDay, ScheduleSlot[]>

/** Left sidebar navigation categories */
const navigationItems: NavigationCategory[] = [
  {
    title: 'Academic Support',
    icon: Book,
    items: [
      'Exam schedules and policies',
      'Study resources',
      'Course registration',
      'Academic calendar',
      'Grade appeals',
    ],
  },
  {
    title: 'Campus Life',
    icon: Home,
    items: [
      'Housing information',
      'Dining services',
      'Student organizations',
      'Campus events',
      'Sports facilities',
    ],
  },
  {
    title: 'Career Services',
    icon: Briefcase,
    items: [
      'Job postings',
      'Interview preparation',
      'Resume workshops',
      'Career fairs',
      'Internship opportunities',
    ],
  },
  {
    title: 'Alumni Network',
    icon: GraduationCap,
    items: [
      'Alumni directory',
      'Mentorship programs',
      'Networking events',
      'Success stories',
      'Alumni benefits',
    ],
  },
  {
    title: 'Lost and Found',
    icon: Search,
    items: [
      'Report lost items',
      'Found item submission',
      'Claim process',
      'Item tracking',
      'Contact information',
    ],
  },
  {
    title: 'Social Activities',
    icon: PartyPopper,
    items: [
      'Club meetups',
      'Cultural festivals',
      'Social gatherings',
      'Volunteer opportunities',
      'Student initiatives',
    ],
  },
  {
    title: 'Health & Wellness',
    icon: Heart,
    items: [
      'Medical services',
      'Counseling support',
      'Fitness programs',
      'Health insurance',
      'Emergency contacts',
    ],
  },
  {
    title: 'Administrative',
    icon: Settings,
    items: [
      'Fee payment',
      'Document requests',
      'ID card services',
      'Technical support',
      'Campus policies',
    ],
  },
]

/** Right sidebar navigation categories */
const rightNavigationItems: NavigationCategory[] = [
  {
    title: 'Jobs',
    icon: Briefcase,
    items: [
      'Software Engineer - Google',
      'Product Manager - Amazon',
      'Data Scientist - Microsoft',
      'UI/UX Designer - Apple',
      'Full Stack Developer - Meta',
    ],
  },
  {
    title: 'Events',
    icon: Calendar,
    items: [
      'Tech Conference 2025',
      'Career Fair - Spring',
      'Alumni Networking Night',
      'Hackathon Challenge',
      'Industry Expert Talk',
    ],
  },
]

/** Sample timetable data */
const timetableData: TimetableData = {
  Monday: [
    { time: '9:00 AM', subject: 'Data Structures', room: 'Lab 201' },
    { time: '11:00 AM', subject: 'Web Development', room: 'Room 302' },
    { time: '2:00 PM', subject: 'Machine Learning', room: 'Lab 105' },
  ],
  Tuesday: [
    { time: '10:00 AM', subject: 'Database Systems', room: 'Room 401' },
    { time: '1:00 PM', subject: 'Cloud Computing', room: 'Lab 203' },
  ],
  Wednesday: [
    { time: '9:00 AM', subject: 'Software Engineering', room: 'Room 301' },
    { time: '11:30 AM', subject: 'AI Fundamentals', room: 'Lab 102' },
  ],
}

/** Sample attendance data */
const attendanceData: AttendanceRecord[] = [
  { subject: 'Data Structures', percentage: 85, classes: '34/40' },
  { subject: 'Web Development', percentage: 92, classes: '37/40' },
  { subject: 'Machine Learning', percentage: 78, classes: '31/40' },
  { subject: 'Database Systems', percentage: 88, classes: '35/40' },
]

interface NavigationProps {
  /** Callback when a category item is selected */
  onCategorySelect?: (category: string, item: string) => void
  /** Whether the AI bot is currently active */
  isBotActive?: boolean
}

interface NavigationContentProps {
  items: NavigationCategory[]
  isRight?: boolean
  activeCategory: string | null
  handleCategoryClick: (category: string) => void
  handleItemClick: (category: string, item: string) => void
  isLeftSidebarCollapsed: boolean
  selectedDay: TimetableDay
  setSelectedDay: (day: TimetableDay) => void
}

/**
 * Returns the appropriate color class based on attendance percentage.
 */
function getAttendanceColor(percentage: number): string {
  if (percentage >= 85) return 'text-green-500'
  if (percentage >= 75) return 'text-yellow-500'
  return 'text-red-500'
}

/**
 * Returns the appropriate background color class based on attendance percentage.
 */
function getAttendanceBgColor(percentage: number): string {
  if (percentage >= 85) return 'bg-green-500'
  if (percentage >= 75) return 'bg-yellow-500'
  return 'bg-red-500'
}

/**
 * Inner content component for navigation sidebars.
 */
const NavigationContent = ({
  items,
  isRight = false,
  activeCategory,
  handleCategoryClick,
  handleItemClick,
  isLeftSidebarCollapsed,
  selectedDay,
  setSelectedDay,
}: NavigationContentProps) => (
  <ScrollArea
    className={cn(
      'h-[calc(100vh-4rem)]',
      isRight ? 'bg-card/5' : 'bg-transparent'
    )}
  >
    <div
      className={cn('space-y-2', isLeftSidebarCollapsed ? 'px-2 py-4' : 'p-4')}
    >
      {/* Navigation Categories */}
      {!isLeftSidebarCollapsed &&
        items.map((category) => (
          <motion.div
            key={category.title}
            initial={false}
            animate={{
              backgroundColor:
                activeCategory === category.title
                  ? 'hsl(var(--accent))'
                  : 'transparent',
            }}
            className="rounded-lg overflow-hidden"
          >
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-between gap-3 text-base min-h-[44px] rounded-lg',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring',
                'transition-all duration-200 ease-in-out',
                activeCategory === category.title &&
                  'bg-accent text-accent-foreground'
              )}
              onClick={() => handleCategoryClick(category.title)}
            >
              <div className="flex items-center gap-3">
                <category.icon className="h-5 w-5" />
                <span>{category.title}</span>
              </div>
              <motion.div
                animate={{
                  rotate: activeCategory === category.title ? 180 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </Button>

            <AnimatePresence initial={false}>
              {activeCategory === category.title && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden bg-accent/5"
                >
                  <div className="space-y-1 p-2">
                    {category.items.map((item) => (
                      <motion.div
                        key={item}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            'w-full justify-start text-sm font-normal min-h-[44px] pl-10 rounded-lg',
                            'hover:bg-accent/50 hover:text-accent-foreground',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring',
                            'transition-all duration-200 ease-in-out'
                          )}
                          onClick={() => handleItemClick(category.title, item)}
                        >
                          {item}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

      {/* Timetable and Attendance Sections */}
      {!isRight && (
        <div className="mt-8 space-y-6">
          {/* Day Selection */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(Object.keys(timetableData) as TimetableDay[]).map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDay(day)}
                className={cn(
                  'whitespace-nowrap',
                  selectedDay === day && 'bg-primary text-primary-foreground'
                )}
              >
                {day}
              </Button>
            ))}
          </div>

          {/* Timetable Section */}
          <div className="bg-card rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Today&apos;s Schedule</h3>
            </div>
            <div className="space-y-3">
              {timetableData[selectedDay].map((slot, index) => (
                <motion.div
                  key={`${slot.time}-${slot.subject}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-accent/10 p-3 rounded-md hover:bg-accent/20 transition-colors"
                >
                  <div className="text-sm font-medium text-primary">
                    {slot.time}
                  </div>
                  <div className="text-sm font-medium">{slot.subject}</div>
                  <div className="text-xs text-muted-foreground">
                    {slot.room}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Attendance Section */}
          <div className="bg-card rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <BarChart className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Attendance Overview</h3>
            </div>
            <div className="space-y-4">
              {attendanceData.map((subject, index) => (
                <motion.div
                  key={subject.subject}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{subject.subject}</span>
                    <span
                      className={cn(
                        'font-medium',
                        getAttendanceColor(subject.percentage)
                      )}
                    >
                      {subject.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-accent/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.percentage}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={cn(
                        'h-full rounded-full',
                        getAttendanceBgColor(subject.percentage)
                      )}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {subject.classes} classes attended
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  </ScrollArea>
)

/**
 * Main navigation component with responsive sidebars.
 * @param props - Component props
 * @returns The Navigation component
 */
export function Navigation({ onCategorySelect, isBotActive }: NavigationProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false)
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false)
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false)
  const [selectedDay, setSelectedDay] = useState<TimetableDay>('Monday')

  useEffect(() => {
    if (isBotActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCategory(null)
    }
  }, [isBotActive])

  const handleCategoryClick = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category)
  }

  const handleItemClick = (category: string, item: string) => {
    onCategorySelect?.(category, item)
    setIsMobileMenuOpen(false)
    setIsRightMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/80 backdrop-blur-sm shadow-lg rounded-full"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <NavigationContent
              items={navigationItems}
              activeCategory={activeCategory}
              handleCategoryClick={handleCategoryClick}
              handleItemClick={handleItemClick}
              isLeftSidebarCollapsed={isLeftSidebarCollapsed}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex">
        <motion.div
          initial={false}
          animate={{
            width: isLeftSidebarCollapsed ? '64px' : '320px',
            opacity: 1,
          }}
          className="relative h-screen border-r bg-card/50 backdrop-blur-sm"
        >
          <NavigationContent
            items={navigationItems}
            activeCategory={activeCategory}
            handleCategoryClick={handleCategoryClick}
            handleItemClick={handleItemClick}
            isLeftSidebarCollapsed={isLeftSidebarCollapsed}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-background shadow-lg rounded-full z-10"
            onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
          >
            {isLeftSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            width: isRightSidebarCollapsed ? '64px' : '288px',
            opacity: 1,
          }}
          className="relative h-screen border-l bg-card/50 backdrop-blur-sm ml-auto"
        >
          {!isRightSidebarCollapsed && (
            <NavigationContent
              items={rightNavigationItems}
              isRight
              activeCategory={activeCategory}
              handleCategoryClick={handleCategoryClick}
              handleItemClick={handleItemClick}
              isLeftSidebarCollapsed={isLeftSidebarCollapsed}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-background shadow-lg rounded-full z-10"
            onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
          >
            {isRightSidebarCollapsed ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </motion.div>
      </div>

      {/* Mobile Right Navigation */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Sheet open={isRightMenuOpen} onOpenChange={setIsRightMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/80 backdrop-blur-sm shadow-lg rounded-full"
            >
              <Bookmark className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            <NavigationContent
              items={rightNavigationItems}
              isRight
              activeCategory={activeCategory}
              handleCategoryClick={handleCategoryClick}
              handleItemClick={handleItemClick}
              isLeftSidebarCollapsed={isLeftSidebarCollapsed}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

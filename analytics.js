document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    // Observe all analytics cards
    document.querySelectorAll('.analytics-card, .trend-card').forEach(card => {
        observer.observe(card);
        card.classList.add('animate-in');
    });

    // Animate chart bars
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.classList.add('animate');
        }, index * 100);
    });

    // Animate pie chart segments
    const pieSegments = document.querySelectorAll('.pie-segment');
    pieSegments.forEach((segment, index) => {
        setTimeout(() => {
            segment.classList.add('animate');
        }, index * 200);
    });

    // Add hover effects for peak hours
    document.querySelectorAll('.peak-hour').forEach(hour => {
        hour.addEventListener('mouseenter', () => {
            const fill = hour.querySelector('.peak-fill');
            const value = fill.style.width;
            hour.setAttribute('data-value', value);
            fill.style.transform = 'scaleX(1.05)';
        });

        hour.addEventListener('mouseleave', () => {
            const fill = hour.querySelector('.peak-fill');
            fill.style.transform = 'scaleX(1)';
        });
    });

    // Animate savings numbers
    document.querySelectorAll('.savings-value').forEach(value => {
        const finalValue = value.textContent;
        const numericValue = parseFloat(finalValue.replace(/[$,]/g, ''));
        value.textContent = '$0';
        
        let currentValue = 0;
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = numericValue / steps;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                clearInterval(timer);
                value.textContent = finalValue;
            } else {
                value.textContent = '$' + currentValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }, duration / steps);
    });

    // Add interactivity to trend charts
    document.querySelectorAll('.trend-chart').forEach(chart => {
        const trendLine = chart.querySelector('.trend-line');
        const points = trendLine.style.getPropertyValue('--points').split(',');
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'trend-tooltip';
        chart.appendChild(tooltip);
        
        chart.addEventListener('mousemove', (e) => {
            const rect = chart.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const index = Math.floor((x / rect.width) * (points.length - 1));
            
            if (index >= 0 && index < points.length) {
                tooltip.style.opacity = '1';
                tooltip.style.left = `${x}px`;
                tooltip.style.top = `${rect.height - (points[index] * rect.height / 100)}px`;
                tooltip.textContent = `Value: ${points[index]}%`;
            }
        });
        
        chart.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });

    // Enhanced line chart interactivity
    document.querySelectorAll('.line-chart').forEach(chart => {
        const dataPoints = chart.querySelectorAll('.data-points circle');
        const linePath = chart.querySelector('.line-path');
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'trend-tooltip';
        chart.parentElement.appendChild(tooltip);

        // Add hover effects for data points
        dataPoints.forEach(point => {
            point.addEventListener('mouseenter', (e) => {
                // Get point coordinates
                const x = point.getAttribute('cx');
                const y = point.getAttribute('cy');
                
                // Calculate percentage value based on y coordinate
                const value = Math.round((1 - y / 200) * 100);
                
                // Show tooltip
                tooltip.style.opacity = '1';
                tooltip.style.transform = `translate(${x}px, ${y - 20}px)`;
                tooltip.textContent = `${value}%`;
                
                // Highlight point
                point.setAttribute('r', '6');
                point.style.fill = 'var(--accent-color, #4CAF50)';
                
                // Add glow effect to line
                linePath.style.filter = 'drop-shadow(0 0 8px rgba(76, 175, 80, 0.5))';
            });
            
            point.addEventListener('mouseleave', () => {
                // Hide tooltip
                tooltip.style.opacity = '0';
                
                // Reset point
                point.setAttribute('r', '4');
                point.style.fill = 'white';
                
                // Remove glow effect
                linePath.style.filter = 'drop-shadow(0 0 6px rgba(76, 175, 80, 0.3))';
            });
        });

        // Add hover effect for the entire chart
        chart.addEventListener('mousemove', (e) => {
            const rect = chart.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Find closest point
            let closestPoint = null;
            let minDistance = Infinity;
            
            dataPoints.forEach(point => {
                const pointX = point.getAttribute('cx') * rect.width / 300;
                const pointY = point.getAttribute('cy') * rect.height / 200;
                const distance = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2));
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPoint = point;
                }
            });
            
            // Highlight closest point if within reasonable distance
            if (minDistance < 30) {
                const event = new MouseEvent('mouseenter');
                closestPoint.dispatchEvent(event);
            }
        });
        
        // Add smooth animation for line drawing
        const length = linePath.getTotalLength();
        linePath.style.strokeDasharray = length;
        linePath.style.strokeDashoffset = length;
        
        // Trigger animation when chart comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    linePath.style.animation = 'drawLine 2s ease-out forwards';
                    
                    // Animate data points
                    dataPoints.forEach((point, index) => {
                        setTimeout(() => {
                            point.style.animation = 'fadeInPoints 0.5s ease-out forwards';
                        }, index * 100);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(chart);
    });

    // Bar Chart Interactivity
    document.querySelectorAll('.bar-chart').forEach(chart => {
        const bars = chart.querySelectorAll('.bars rect');
        const chartContainer = chart.closest('.chart-container');
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'bar-tooltip';
        chartContainer.appendChild(tooltip);

        bars.forEach(bar => {
            bar.addEventListener('mouseenter', (e) => {
                const value = bar.getAttribute('data-value');
                const rect = bar.getBoundingClientRect();
                const containerRect = chartContainer.getBoundingClientRect();
                
                // Show tooltip
                tooltip.textContent = `${value}%`;
                tooltip.style.opacity = '1';
                tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - containerRect.top - 30}px`;
                
                // Highlight bar
                bar.style.filter = 'drop-shadow(0 0 8px rgba(76, 175, 80, 0.5))';
            });
            
            bar.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                bar.style.filter = 'drop-shadow(0 0 4px rgba(76, 175, 80, 0.3))';
            });
        });
    });

    // Pie Chart Interactivity
    document.querySelectorAll('.pie-chart').forEach(chart => {
        const segments = chart.querySelectorAll('.pie-segment');
        const labels = chart.querySelectorAll('.pie-label');
        
        segments.forEach((segment, index) => {
            segment.addEventListener('mouseenter', () => {
                // Highlight segment
                segment.style.transform = 'scale(1.05)';
                segment.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))';
                
                // Highlight corresponding label
                if (labels[index]) {
                    labels[index].style.fontWeight = 'bold';
                    labels[index].style.fontSize = '14px';
                }
            });
            
            segment.addEventListener('mouseleave', () => {
                // Reset segment
                segment.style.transform = 'scale(1)';
                segment.style.filter = 'none';
                
                // Reset label
                if (labels[index]) {
                    labels[index].style.fontWeight = 'normal';
                    labels[index].style.fontSize = '12px';
                }
            });
        });
    });

    // Legend Interactivity
    document.querySelectorAll('.legend-item').forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            const chart = item.closest('.pie-container').querySelector('.pie-chart');
            const segment = chart.querySelectorAll('.pie-segment')[index];
            const label = chart.querySelectorAll('.pie-label')[index];
            
            if (segment) {
                segment.style.transform = 'scale(1.05)';
                segment.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))';
            }
            
            if (label) {
                label.style.fontWeight = 'bold';
                label.style.fontSize = '14px';
            }
            
            item.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', () => {
            const chart = item.closest('.pie-container').querySelector('.pie-chart');
            const segment = chart.querySelectorAll('.pie-segment')[index];
            const label = chart.querySelectorAll('.pie-label')[index];
            
            if (segment) {
                segment.style.transform = 'scale(1)';
                segment.style.filter = 'none';
            }
            
            if (label) {
                label.style.fontWeight = 'normal';
                label.style.fontSize = '12px';
            }
            
            item.style.transform = 'translateX(0)';
        });
    });
}); 